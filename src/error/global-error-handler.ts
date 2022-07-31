import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import BaseError from './base-error';
import handleBaseError from './base-error-handler';

/**
 * Error handler middleware.
 * @param error error object
 * @param req request
 * @param res response
 * @param next next middleware Function
 */
export default function globalErrorHandler(
	error: any,
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (error instanceof BaseError) return handleBaseError(error, res);

	if (error instanceof JsonWebTokenError)
		return res.status(403).json({
			status: 'Authorization Error',
			code: 403,
			message: 'Unauthorized: invalid token.',
		});

	console.log(error); // for development only

	res.status(500).json({
		status: 'Internal Server Error',
		code: 500,
		message: 'An error occured while processing your request.',
	});
}
