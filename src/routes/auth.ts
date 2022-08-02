import { Router } from 'express';
import login from '../auth/login';
import createUser from '../auth/register';
import asyncWrapper from '../middleware/async-wrapper';
import recoverAccount from '../auth/recovery';

const router: Router = Router();

router.route('/login').post(asyncWrapper(login));
router.route('/register').post(asyncWrapper(createUser));
router.route('/recovery').post(asyncWrapper(recoverAccount));

export { router as authRoutes };
