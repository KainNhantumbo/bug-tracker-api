import { v4 as uuidV4 } from 'uuid';
import BaseError from '../error/base-error';
import UserModel from '../models/User';
import { Request, Response } from 'express';
import { ControllerResponse } from '../types/functions';

const createUser = async (req: Request, res: Response): ControllerResponse => {
	const { password, ...data } = req.body;
	let pass: string = String(password);
	if (pass.length < 6)
		throw new BaseError('Your password must have at least 6 characteres.', 400);
	const user_key: string = uuidV4();
	await UserModel.create({
		recouvery_key: user_key,
		password: pass,
		...data,
	});
	res.status(201).json({ user_recouvery: user_key });
};

export default createUser;
