import UserModel from '../models/User';
import BaseError from '../error/base-error';
import { Request as IReq, Response as IRes } from 'express';
import { ControllerResponse } from '../types/functions';
import bcrypt from 'bcrypt';

// used to recouver account when user forgot password
const recoverAccount = async (req: IReq, res: IRes): ControllerResponse => {
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

export default recoverAccount;
