import {
	Request as req,
	Response as res,
	NextFunction as nextFn,
} from 'express';
import { HandledFunction } from '../types/functions';

/**
 * Wrapper function for global error handling.
 * @param fn asynchronous function to be wrapped and error handled.
 * @returns Promise<...>
 */
export default function asyncWrapper(fn: HandledFunction) {
	return function (req: req, res: res, next: nextFn) {
		return Promise.resolve(fn(req, res, next)).catch(next);
	};
}
