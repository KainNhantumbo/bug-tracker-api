import express from 'express';
import { Application } from 'express';
import { config } from 'dotenv';
import bootstrap from './server/server';

config()
const app: Application = express();
const PORT = process.env.PORT || 6700

// starts the server
bootstrap(PORT, process.env.MONGO_URI || '')
