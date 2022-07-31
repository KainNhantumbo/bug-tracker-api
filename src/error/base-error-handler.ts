import { Response } from 'express';

export default function handleBaseError(err: any, res: Response) {
	const { message, status_code } = err;
	return res.status(status_code).json({
		message,
		code: status_code,
	});
}
