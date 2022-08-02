import { Router } from 'express';
import login from '../auth/login';
import createUser from '../auth/register';
import asyncWrapper from '../middleware/async-wrapper';
import recouverAccount from '../auth/recouvery';

const router: Router = Router();

router.route('/login').post(asyncWrapper(login));
router.route('/register').post(asyncWrapper(createUser));
router.route('/recouvery').post(asyncWrapper(recouverAccount));

export { router as authRoutes };
