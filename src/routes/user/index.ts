import { Router } from 'express';
import userLoginRouter from '@routes/user/login'
import userCheckRouter from '@routes/user/check'
import statusCheckRouter from '@routes/user/status'

const path = '/user';
const router = Router();

router.use(userLoginRouter.path, userLoginRouter.router);
router.use(userCheckRouter.path, userCheckRouter.router);
router.use(statusCheckRouter.path, statusCheckRouter.router);

export default {
	router,
	path
}