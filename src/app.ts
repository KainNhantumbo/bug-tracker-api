import express, { Application } from 'express';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import cors, { CorsOptions } from 'cors';
import globalErrorHandler from './error/global-error-handler';
import bootstrap from './server/server';
import authenticator from './middleware/auth-middleware';
import { config } from 'dotenv';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { bugRoutes } from './routes/bugs';
import { error404Route } from './routes/404';

// server config
config();
const PORT = process.env.PORT || 8500;
const app: Application = express();

const cors_options: CorsOptions = {
	origin: [
		'http://localhost:3000',
		'https://bug-tracker-5e7x8pq4e-kainnhantumbo.vercel.app',
		'https://bug-tracker-pied.vercel.app',
		'https://bug-tracker-kainnhantumbo.vercel.app',
		'https://bug-tracker-git-master-kainnhantumbo.vercel.app/',
	],
	methods: ['GET', 'POST', 'DELETE', 'PATCH'],
	optionsSuccessStatus: 200,
};

const limiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	max: 1200,
	standardHeaders: true,
	legacyHeaders: false,
});

app.use(cors(cors_options));
app.use(limiter);
app.use(helmet());
app.use(express.json());

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
