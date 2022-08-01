import { NextFunction, Request, Response } from 'express';
import BaseError from '../error/base-error';
import { verifyToken } from '../utils/jwt-helpers';
import { config } from 'dotenv';

// loads environment variables
config();

export default async function auth(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer '))
		throw new BaseError('Unauthorized: invalid token.', 401);
	const token = authHeader.split(' ')[1];
	const payload: any = await verifyToken(token, process.env.JWT_SECRET || '');
	// inserts user id and user name into request middleware
	(req as any).user.user_id = payload.user_id;
	next();
}
