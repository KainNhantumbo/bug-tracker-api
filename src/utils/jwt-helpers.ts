import jwt from 'jsonwebtoken';

interface PayloadProps {
	name: string;
	reference: string;
}

/**
 * @param payload Object that must contain user reference and name
 * @returns token
 */
const createToken = async (payload: PayloadProps) =>
	new Promise((resolve) => {
		const secret = process.env.JWT_SECRET || '';
		const token = jwt.sign(
			{ ref: payload.reference, name: payload.name },
			secret,
			{
				expiresIn: process.env.JWT_EXPDATE,
			}
		);
		resolve(token);
	});

/**
 * An asynchronous function to verify integrity of the token.
 * @param token string
 * @param secret string
 * @returns Promise<unknown>
 */
const verifyToken = (token: string, secret: string) =>
	new Promise((resolve) => {
		const result = jwt.verify(token, secret);
		resolve(result);
	});

export { createToken, verifyToken };
