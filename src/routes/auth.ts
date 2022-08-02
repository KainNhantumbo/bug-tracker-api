import asyncWrapper from '../middleware/async-wrapper';
import { Router } from 'express';
import createUser from '../auth/register';

const router = Router();

router.route('/register').post(asyncWrapper(createUser));

export { router as authRoutes };
