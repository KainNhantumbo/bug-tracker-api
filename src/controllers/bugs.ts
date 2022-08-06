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
	const { sort, search, fields, offset, limit } = req.query;
	const queryObject: any = { createdBy: user };

	if (search) {
		queryObject['$or'] = [
			{ title: { $regex: search, $options: 'i' } },
			{ author: { $regex: search, $options: 'i' } },
			{ priority: { $regex: search, $options: 'i' } },
			{ feature: { $regex: search, $options: 'i' } },
			{ status: { $regex: search, $options: 'i' } },
		];
	}

	let queryResult = BugModel.find(queryObject);

	if (fields) {
		let fieldsList = (fields as string).split(',').join(' ');
		queryResult = queryResult.select(fieldsList);
	}

	if (sort) {
		let sortPattern: string = sort.toString();
		queryResult = queryResult.sort(sortPattern);
	} else {
		queryResult = queryResult.sort('title');
	}

	if (limit && offset) {
		queryResult = queryResult.skip(Number(offset)).limit(Number(limit));
	}

	const bugs = await queryResult;
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
