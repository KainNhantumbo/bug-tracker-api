export default class BaseError extends Error {
	public readonly message: string;
	public readonly status_code: number;

	constructor(message: string, status_code: number) {
		super(message);
		this.message = message;
		this.status_code = status_code;
	}
}
