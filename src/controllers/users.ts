import UserModel from '../models/User';
import { ControllerResponse } from '../types/functions';
import { Request, Response } from 'express';

export const getUsers = async (
	req: Request,
	res: Response
): ControllerResponse => {
	const users = await UserModel.find({});
	res.status(200).json({ amount: users.length, users });
};

export const getUser = async (
	req: Request,
	res: Response
): ControllerResponse => {
	const { user_id } = req.body;
	const user = await UserModel.findOne({ _id: user_id });
	res.status(200).json({ user });
};

export const deleteUser = async (
	req: Request,
	res: Response
): ControllerResponse => {
	const { user_id } = req.body;
	await UserModel.deleteOne({ _id: user_id });
	res.status(200).json({ message: 'User deleted.' });
};
