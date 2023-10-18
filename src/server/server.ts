import { Application } from 'express';
import db from '../db/connection';

const bootstrap = async (
	port: string | number,
	db_uri: string,
	app: Application
) => {
	try {
		await db(db_uri);
		app.listen(port, () => {
			console.log(`Server running on port ${port}`);
		});
	} catch (err) {
		console.error(err);
	}
};

export default bootstrap;
