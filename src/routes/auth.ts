import { Router } from 'express';
import asyncWrapper from '../middleware/async-wrapper';
import createUser from '../auth/register';
import login from '../auth/login';

const router = Router();

router.route('/register').post(asyncWrapper(createUser));
router.route('/login').post(asyncWrapper(login));

export { router as authRoutes };
