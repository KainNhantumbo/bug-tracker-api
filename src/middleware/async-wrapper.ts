import {
	Request as IReq,
	Response as IRes,
	NextFunction as INextFn,
} from 'express';
import { HandledFunction } from '../types/functions';

/**
 * Wrapper function for global error handling.
 * @param fn asynchronous function to be wrapped and error handled.
 * @returns Promise<...>
 */
export default function asyncWrapper(fn: HandledFunction) {
	return function (req: IReq, res: IRes, next: INextFn) {
		return Promise.resolve(fn(req, res, next)).catch(next);
	};
}
