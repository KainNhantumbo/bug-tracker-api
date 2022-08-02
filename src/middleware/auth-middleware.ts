import {
	Request as IReq,
	Response as IRes,
	NextFunction as nextFn,
} from 'express';
import BaseError from '../error/base-error';
import { verifyToken } from '../utils/jwt-helpers';
import { config } from 'dotenv';

// loads environment variables
config();

async function auth(req: IReq, res: IRes, next: nextFn): Promise<void> {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer '))
		throw new BaseError('Unauthorized: invalid token.', 401);
	const token = authHeader.split(' ')[1];
	const payload: any = await verifyToken(token, process.env.ACCESS_TOKEN || '');
	// inserts user id into request middleware
	req.body.user = payload.user_id;
	next();
}

export default auth;
