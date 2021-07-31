import { Router } from "express";

import userRouter from '@routes/user'
import configRouter from '@routes/config'
import cardRouter from '@routes/card'
import logRouter from '@routes/log';

const router = Router();
const path = '';

router.use(userRouter.path, userRouter.router);
router.use(cardRouter.path, cardRouter.router);
router.use(logRouter.path, logRouter.router);
router.use(configRouter.path, configRouter.router);

export default {
	router,
	path
};