import { Router } from 'express';
import {
  login,
  logout,
  refresh,
  accountRecovery,
} from '../controllers/auth-controller';
import { createUser } from '../controllers/users-controller';
import asyncWrapper from '../middleware/async-wrapper';

const router: Router = Router();

router.route('/login').post(asyncWrapper(login));
router.route('/register').post(asyncWrapper(createUser));
router.route('/recovery').post(asyncWrapper(accountRecovery));
router.route('/refresh').get(asyncWrapper(refresh));
router.route('/logout').post(logout);

export { router as authRoutes };
