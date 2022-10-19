import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
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
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof BaseError) return handleBaseError(error, res);

  if (error instanceof JsonWebTokenError)
    return res.status(401).json({
      status: 'Authorization Error',
      code: 401,
      message: 'Unauthorized: invalid token.',
    });

  if (error.name == 'MongoServerError') {
    if (error.message.split(' ')[0] == 'E11000') {
      return res.status(409).json({
        status: 'Conflict Error',
        code: 409,
        message:
          'This e-mail is already used by another account. Try another one.',
      });
    }
  }

  console.error('An uncaught error occured: ', error);
  res.status(500).json({
    status: 'Internal Server Error',
    code: 500,
    message: 'An error occured while processing your request.',
  });
}
