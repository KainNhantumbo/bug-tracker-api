import { v4 as uuidV4 } from 'uuid';
import BaseError from '../error/base-error';
import UserModel from '../models/User';
import { Request, Response } from 'express';
import { ControllerResponse } from '../types/functions';
import * as bcrypt from 'bcrypt';

const createUser = async (req: Request, res: Response): ControllerResponse => {
	const { password, ...data } = req.body;

	let pwd: string = String(password);
	if (pwd.length < 6)
		throw new BaseError('Password must have at least 6 characters.', 400);

	// id to be used as user account recovery key
	let ramdom_id: string = uuidV4()
		.toUpperCase()
		.split('-')
		.join('')
		.slice(0, 21);

	// hashing password and user recouvery key
	const salt = await bcrypt.genSalt(10);
	pwd = await bcrypt.hash(pwd, salt);
	const user_key = await bcrypt.hash(ramdom_id, salt);
	// creating user
	await UserModel.create({
		recovery_key: user_key,
		password: pwd,
		...data,
	});
	res.status(201).json({ user_recovery: ramdom_id });
};

export default createUser;
