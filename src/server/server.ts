import express, { Application } from 'express';
import db from '../db/connection';

const app: Application = express();

const bootstrap = async (port: string | number, db_uri: string) => {
	try {
		await db(db_uri);
		app.listen(port, () => {
			console.log(`Server running on port ${port}`);
		});
	} catch (err) {
		console.log(err);
	}
};

export default bootstrap;
