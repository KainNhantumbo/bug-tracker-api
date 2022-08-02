import express, { Application } from 'express';
import bootstrap from './server/server';
import { config } from 'dotenv';
import globalErrorHandler from './error/global-error-handler';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { bugRoutes } from './routes/bugs';

config();
const PORT = process.env.PORT || 6700;
const app: Application = express();

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/bugs', bugRoutes);

app.use(globalErrorHandler);

// starts the server
bootstrap(PORT, process.env.MONGO_URI || '');
