import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import globalErrorHandler from './error/global-error-handler';
import bootstrap from './server/server';
import authenticator from './middleware/auth-middleware';
import { config } from 'dotenv';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { bugRoutes } from './routes/bugs';
import { error404Route } from './routes/404';
import cookieParser from 'cookie-parser'
import corsOptions from './config/cors-config';
import rateLimiter from './config/rate-limiter';

// server config
config();
const PORT = process.env.PORT || 8500;
const app: Application = express();

app.use(cors(corsOptions));
app.use(rateLimiter);
app.use(helmet());
app.use(express.json());
app.use(cookieParser())

// server open routes
app.use('/api/v1/auth', authRoutes);

// server protected routes
app.use(authenticator);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/bugs', bugRoutes);

// error handling
app.use(error404Route);
app.use(globalErrorHandler);

// starts the server
bootstrap(PORT, process.env.MONGO_URI || '', app);
