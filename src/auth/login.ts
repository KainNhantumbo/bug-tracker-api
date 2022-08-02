import UserModel from '../models/User';
import bcrypt from 'bcrypt';
import { createToken } from '../utils/jwt-helpers';
import { Request as IReq, Response as IRes } from 'express';
import { ControllerResponse } from '../types/functions';
import BaseError from '../error/base-error';
import { config } from 'dotenv';

// loads env variables
config();

export default async function login(req: IReq, res: IRes): ControllerResponse {
	const { password, email } = req.body;
	if (!password || !email)
		throw new BaseError('Please provide your email and password.', 400);

	const user = await UserModel.find({ email: email });
	if (!user)
		throw new BaseError(
			'User with provided provided email is not found. Please check and try again.',
			404
		);

	const match = await bcrypt.compare(password, user[0].password);
	if (!match)
		throw new BaseError('Wrong password. Please check and try again.', 401);

	const token = await createToken(
		user[0]._id as any,
		process.env.ACCESS_TOKEN || '',
		'1d'
	);
	res.status(200).json({ token, username: user[0].user_name });
}
