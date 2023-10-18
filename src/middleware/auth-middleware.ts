import {
  Request as IReq,
  Response as IRes,
  NextFunction as INextFn,
} from 'express';
import BaseError from '../error/base-error';
import { verifyToken } from '../utils/jwt-helpers';
import { config } from 'dotenv';
import { TokenExpiredError } from 'jsonwebtoken';

// loads environment variables
config();

const authenticator = async (
  req: IReq,
  res: IRes,
  next: INextFn
): Promise<IRes<any, Record<string, any>> | undefined> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
      throw new BaseError('Unauthorized: invalid token.', 401);
    const token = authHeader.split(' ')[1];
    const payload: any = await verifyToken(
      token,
      process.env.ACCESS_TOKEN || ''
    );
    if (!payload) throw new BaseError('Error: Invalid token.', 403);
    // inserts user id into request middleware
    req.body.user = payload.user_id;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError)
      return res.status(403).json({
        status: 'Token Expired Error',
        code: 403,
        message: 'Unauthorized: expired token.',
      });
    next();
  }
};

export default authenticator;
