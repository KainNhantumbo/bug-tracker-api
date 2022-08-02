import { v4 as uuidV4 } from 'uuid';
import BaseError from '../error/base-error';
import UserModel from '../models/User';
import { Request, Response } from 'express';
import { ControllerResponse } from '../types/functions';

const createUser = async (req: Request, res: Response): ControllerResponse => {
	const { password } = req.body;
	let pass: string = String(password);
	if (pass.length < 6)
		throw new BaseError('Your password must have at least 6 characteres.', 400);
	req.body.recouvery_key = uuidV4();
	const user = await UserModel.create({ ...req.body });
	res.status(201).json({ user_key: req.body.recouvery_key, user_id: user._id });
};

export default createUser;
