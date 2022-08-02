import { Router } from 'express';
import asyncWrapper from '../middleware/async-wrapper';
import {
	getSingleBug,
	getAllBugs,
	createBug,
	deleteBug,
	updateBug,
} from '../controllers/bugs';

const router: Router = Router();

router.route('/').get(asyncWrapper(getAllBugs)).post(asyncWrapper(createBug));

router
	.route('/:id')
	.get(asyncWrapper(getSingleBug))
	.patch(asyncWrapper(updateBug))
	.delete(asyncWrapper(deleteBug));

export { router as bugRoutes };
