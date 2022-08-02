import UserModel from '../models/User';
import BaseError from '../error/base-error';
import { Request as IReq, Response as IRes } from 'express';
import { ControllerResponse } from '../types/functions';
import bcrypt from 'bcrypt';

// used to recouver account when user forgot password
const recouverAccount = async (req: IReq, res: IRes): ControllerResponse => {
	const { user_email, recouvery_key, password } = req.body;
	if (!password || !user_email)
		throw new BaseError('Please provide your email and password.', 400);

	const user_data = await UserModel.find({ email: user_email });
	if (!user_data)
		throw new BaseError(
			'User with provided provided email is not found. Please check and try again.',
			400
		);

	if (!recouvery_key)
		throw new BaseError('Please provide your account recouvery key.', 400);

	const match = await bcrypt.compare(recouvery_key, user_data[0].recouvery_key);
	if (!match)
		throw new BaseError(
			'Invalid account recouvery key. Please check and try again.',
			400
		);

	const pwd: string = String(password);
	if (pwd.length < 6)
		throw new BaseError('Your password must have at least 6 characteres.', 400);

	await UserModel.updateOne(
		{ _id: user_data[0]._id },
		{ password: pwd },
		{ runValidators: true }
	);

	res.status(200).json({ message: 'Account password updated successfuly.' });
};

export default recouverAccount;
