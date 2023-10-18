import { Router } from 'express';
import { getSingleUser, deleteUser, updateUser } from '../controllers/users-controller';
import asyncWrapper from '../middleware/async-wrapper';

const router: Router = Router();

router
	.route('/')
	.get(asyncWrapper(getSingleUser))
	.patch(asyncWrapper(updateUser));

router.route('/:id').delete(asyncWrapper(deleteUser));

export { router as userRoutes };
