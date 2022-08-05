import UserModel from '../models/User';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { createToken } from '../utils/jwt-helpers';
import { Request as IReq, Response as IRes } from 'express';
import { ControllerResponse } from '../types/functions';
import BaseError from '../error/base-error';

// loads env variables
config();

export default async function login(req: IReq, res: IRes): ControllerResponse {
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

	const token = await createToken(
		user_id,
		process.env.ACCESS_TOKEN || '',
		'1d'
	);
	res.status(200).json({ token, username: user.user_name });
}
