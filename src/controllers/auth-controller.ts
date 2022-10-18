import * as bcrypt from 'bcrypt';
import UserModel from '../models/User';
import { config } from 'dotenv';
import { createToken, verifyToken } from '../utils/jwt-helpers';
import { Request as IReq, Response as IRes } from 'express';
import { ControllerResponse } from '../types/functions';
import BaseError from '../error/base-error';

// loads env variables
config();

const login = async (req: IReq, res: IRes): ControllerResponse => {
  const PROD_ENV = process.env.NODE_ENV == 'development' ? false : true;
  const { password, email } = req.body;
  if (!password || !email)
    throw new BaseError('Please provide your email and password.', 400);

  const user = await UserModel.findOne({ email: email });
  if (!user)
    throw new BaseError(
      'Account not found. Please check your e-mail and try again.',
      404
    );

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    throw new BaseError('Wrong password. Please check and try again.', 401);

  const user_id: any = user._id;
  const accessToken = await createToken(
    user_id,
    process.env.ACCESS_TOKEN || '',
    '10s'
  );
  const refreshToken = await createToken(
    user_id,
    process.env.REFRESH_TOKEN || '',
    '2m'
  );

  res
    .status(200)
    .cookie('token', refreshToken, {
      httpOnly: true,
      secure: PROD_ENV && true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    res.json({ username: user.user_name, accessToken });
};

// used to recover account when user forgot password
const accountRecovery = async (req: IReq, res: IRes): ControllerResponse => {
  const { user_email, recovery_key, password } = req.body;
  if (!password || !user_email)
    throw new BaseError('Please provide your email and password.', 400);

  const user_data = await UserModel.findOne({ email: user_email });

  if (!user_data)
    throw new BaseError(
      'User with provided provided e-mail adress not found. Please check and try again.',
      404
    );

  if (!recovery_key)
    throw new BaseError('Please provide your account recovery key.', 400);

  const match = await bcrypt.compare(recovery_key, user_data.recovery_key);
  if (!match)
    throw new BaseError(
      'Invalid account recovery key. Please check and try again.',
      400
    );

  let pwd: string = String(password);
  if (pwd.length < 6)
    throw new BaseError('Your password must have at least 6 characteres.', 400);
  // password hashing
  const salt = await bcrypt.genSalt(10);
  pwd = await bcrypt.hash(pwd, salt);

  await UserModel.updateOne(
    { _id: user_data._id },
    { password: pwd },
    { runValidators: true }
  );
  res.status(200).json({ message: 'Account password updated successfuly.' });
};

// refresh token function
const refresh = async (req: IReq, res: IRes): Promise<void> => {
  const tokenCookie = req.cookies.token;
  console.log(tokenCookie);
  if (!tokenCookie) throw new BaseError('Unauthorized: Invalid token.', 401);
  const decodedPayload: any = await verifyToken(
    tokenCookie,
    process.env.REFRESH_TOKEN || ''
  );
  const user = await UserModel.findOne({ _id: decodedPayload.user_id });
  if (!user) throw new BaseError('Unauthorized: invalid token.', 401);
  const accessToken = await createToken(
    user._id as unknown as string,
    process.env.ACCESS_TOKEN || '',
    '20s'
  );
  res.status(200).json({ accessToken });
};

// log out function
const logout = (
  req: IReq,
  res: IRes
): IRes<any, Record<string, any>> | undefined => {
  const PROD_ENV = process.env.NODE_ENV == 'development' ? false : true;
  const tokenCookie = req.cookies.token;
  if (!tokenCookie) return res.status(204).json({ message: 'Invalid cookie' });
  res
    .clearCookie('token', {
      httpOnly: true,
      secure: PROD_ENV && true,
      sameSite: 'none',
    })
    .json({ message: 'Cookie cleared.' });
};

export { login, accountRecovery, logout, refresh };
