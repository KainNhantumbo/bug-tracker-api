import { Request as IReq, Response as IRes } from 'express';
import { ControllerResponse } from '../types/functions';
import BugModel from '../models/Bug';

const getSingleBug = async (req: IReq, res: IRes): ControllerResponse => {
	const { id } = req.params;
	const { user } = req.body;
	const bug = await BugModel.findOne({ _id: id, createdBy: user });
	res.status(200).json({ bug });
};

const getAllBugs = async (req: IReq, res: IRes): ControllerResponse => {
	const { user } = req.body;
	const bugs = await BugModel.find({ createdBy: user });
	res.status(200).json({ bugs });
};

const createBug = async (req: IReq, res: IRes): ControllerResponse => {
	const { user, ...data } = req.body;
	await BugModel.create({ createdBy: user, ...data });
	res.status(201).json({ message: 'Saved successfuly.' });
};

const deleteBug = async (req: IReq, res: IRes): ControllerResponse => {
	const { id } = req.params;
	const { user } = req.body;
	await BugModel.deleteOne({ _id: id, createdBy: user });
	res.status(200).json({ message: 'Deleted successfuly.' });
};

const updateBug = async (req: IReq, res: IRes): ControllerResponse => {
	const { id } = req.params;
	const { user, ...data } = req.body;
	await BugModel.updateOne(
		{ _id: id, createdBy: user },
		{ ...data },
		{ runValidators: true }
	);
	res.status(200).json({ message: 'Updated successfully.' });
};

export { getSingleBug, getAllBugs, createBug, updateBug, deleteBug };
