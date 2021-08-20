import { Router } from "express";

import * as userRouter from '@routes/user'
import * as configRouter from '@routes/config'
import * as cardRouter from '@routes/card'
import * as logRouter from '@routes/log';

export const router = Router();
export const path = '';

router.use(userRouter.path, userRouter.router);
router.use(cardRouter.path, cardRouter.router);
router.use(logRouter.path, logRouter.router);
router.use(configRouter.path, configRouter.router);
