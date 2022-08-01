import { v4 as uuidV4 } from 'uuid';
import BaseError from '../error/base-error';
import UserModel from '../models/User';
import { Request, Response } from 'express';
import { ControllerResponse } from '../types/functions';

const createUser = async (
	req: Request,
	res: Response
): ControllerResponse => {};

export default createUser;
