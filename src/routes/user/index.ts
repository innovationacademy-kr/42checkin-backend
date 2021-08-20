import { Router } from 'express';
import * as userLoginRouter from '@routes/user/login'
import * as userCheckRouter from '@routes/user/check'
import * as statusCheckRouter from '@routes/user/status'

export const path = '/user';
export const router = Router();

router.use(userLoginRouter.path, userLoginRouter.router);
router.use(userCheckRouter.path, userCheckRouter.router);
router.use(statusCheckRouter.path, statusCheckRouter.router);
