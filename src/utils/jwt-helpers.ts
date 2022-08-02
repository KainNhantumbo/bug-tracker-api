import jwt from 'jsonwebtoken';

/**
 * @param user_id user id string
 * @param secret jwt secret key
 * @param exp time to token expire
 * @returns Promise<unknown>
 */
const createToken = async (
	user_id: string,
	secret: string,
	exp: string
): Promise<unknown> =>
	new Promise((resolve) => {
		const token = jwt.sign({ user_id }, secret, {
			expiresIn: exp,
		});
		resolve(token);
	});

/**
 * An asynchronous function to verify integrity of the token.
 * @param token string
 * @param secret string
 * @returns Promise<unknown>
 */
const verifyToken = (token: string, secret: string): Promise<unknown> =>
	new Promise((resolve) => {
		const result = jwt.verify(token, secret);
		resolve(result);
	});

export { createToken, verifyToken };
