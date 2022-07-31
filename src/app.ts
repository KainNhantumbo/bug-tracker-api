import express, { Application } from 'express';
import bootstrap from './server/server';
import { config } from 'dotenv';
import globalErrorHandler from './error/global-error-handler';

config();
const PORT = process.env.PORT || 6700;
const app: Application = express();
app.use(globalErrorHandler)

// starts the server
bootstrap(PORT, process.env.MONGO_URI || '');
