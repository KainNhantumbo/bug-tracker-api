import UserModel from '../models/User';
import { ControllerResponse } from '../types/functions';
import { Request as IReq, Response as IRes } from 'express';
import * as bcrypt from 'bcrypt';
import BaseError from '../error/base-error';
import { v4 as uuidV4 } from 'uuid';

const getAllUsers = async (req: IReq, res: IRes): ControllerResponse => {
  const users = await UserModel.find({})
    .select('-password -recovery_key')
    .lean();
  res.status(200).json({ amount: users.length, users });
};

const getSingleUser = async (req: IReq, res: IRes): ControllerResponse => {
  const { user } = req.body;
  const user_data = await UserModel.findOne({ _id: user })
    .select('-password -recovery_key')
    .lean();
  res.status(200).json({ user_data });
};


const createUser = async (req: IReq, res: IRes): ControllerResponse => {
  const { password, email, ...data } = req.body;

  let pwd: string = String(password);
  if (pwd.length < 6)
    throw new BaseError('Password must have at least 6 characters.', 400);

  if (!email) throw new BaseError('Please provide your e-mail adress.', 400);

  // check for duplicates
  const existingUser = await UserModel.exists({ email }).lean();
  if (existingUser)
    throw new BaseError('Account with provided e-mail already exists.', 409);

  // id to be used as user account recovery key
  let ramdom_id: string = uuidV4()
    .toUpperCase()
    .split('-')
    .join('')
    .slice(0, 21);

  // hashing password and user recovery key
  const salt = await bcrypt.genSalt(10);
  pwd = await bcrypt.hash(pwd, salt);
  const user_key = await bcrypt.hash(ramdom_id, salt);
  // creating user
  await UserModel.create({
    recovery_key: user_key,
    password: pwd,
    email,
    ...data,
  });
  res.status(201).json({ user_recovery: ramdom_id });
};

const deleteUser = async (req: IReq, res: IRes): ControllerResponse => {
  const { id: user } = req.params;
  await UserModel.deleteOne({ _id: user }).lean();
  res.status(200).json({ message: 'User deleted.' });
};

const updateUser = async (req: IReq, res: IRes): ControllerResponse => {
  const { user, password, ...data } = req.body;
  // check if user exists
  const isUser = await UserModel.exists({ _id: user }).lean();
  if (!isUser) throw new BaseError('User not found.', 404);

  if (password) {
    let pwd: string = String(password);
    if (pwd.length < 6)
      throw new BaseError(
        'Your password must have at least 6 characteres.',
        400
      );
    // password hashing
    const salt = await bcrypt.genSalt(10);
    pwd = await bcrypt.hash(pwd, salt);

    await UserModel.updateOne(
      { _id: user },
      { password: pwd, ...data },
      { runValidators: true }
    ).lean();
  } else {
    await UserModel.updateOne(
      { _id: user },
      { ...data },
      { runValidators: true }
    ).lean();
  }
  res.status(200).json({ message: 'Account data updated successfuly.' });
};

export { getAllUsers, getSingleUser, createUser,deleteUser, updateUser };
