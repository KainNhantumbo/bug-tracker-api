import UserModel from '../models/User';
import BugModel from '../models/Bug';
import { ControllerResponse } from '../types/functions';
import { Request as IReq, Response as IRes } from 'express';

const getAllUsers = async (req: IReq, res: IRes): ControllerResponse => {
	const users = await UserModel.find({});
	res.status(200).json({ amount: users.length, users });
};

const getSingleUser = async (req: IReq, res: IRes): ControllerResponse => {
	const { user } = req.body;
	const user_data = await UserModel.findOne({ _id: user });
	res.status(200).json({ user_data });
};

const deleteUser = async (req: IReq, res: IRes): ControllerResponse => {
	const { user } = req.body;
	await UserModel.deleteOne({ _id: user });
	await BugModel.deleteMany({ createdBy: user });
	res.status(200).json({ message: 'User deleted.' });
};

export { getAllUsers, getSingleUser, deleteUser };
