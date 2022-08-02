import { Router } from 'express';
import { getSingleUser, deleteUser } from '../controllers/users';
import asyncWrapper from '../middleware/async-wrapper';

const router: Router = Router();

router.route('/').get(asyncWrapper(getSingleUser));
router.route('/:id').get(asyncWrapper(deleteUser));

export { router as userRoutes };
