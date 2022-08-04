import {
	Request as IReq,
	Response as IRes,
	NextFunction as nextFn,
} from 'express';
import BaseError from '../error/base-error';
import { verifyToken } from '../utils/jwt-helpers';
import { config } from 'dotenv';
import asyncWrapper from '../middleware/async-wrapper';

// loads environment variables
config();

const authenticator = asyncWrapper(
	async (req: IReq, res: IRes, next: nextFn): Promise<void> => {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith('Bearer '))
			throw new BaseError('Unauthorized: invalid token.', 401);
		const token = authHeader.split(' ')[1];
		const payload: any = await verifyToken(
			token,
			process.env.ACCESS_TOKEN || ''
		);
		if (!payload) throw new BaseError('Invalid token.', 401);
		// inserts user id into request middleware
		req.body.user = payload.user_id;
		next();
	}
);
export default authenticator;
