import { Router } from "express";

import * as userRouter from '@routes/user'
import * as configRouter from '@routes/config'
import * as logRouter from '@routes/log';
import { Sequelize } from "@models/index";

export const router = Router();
export const path = '';

router.use(userRouter.path, userRouter.router);
router.use(logRouter.path, logRouter.router);
router.use(configRouter.path, configRouter.router);
router.get('/healthCheck', (req, res, next) => {
    Sequelize().sync({ force: false })
        .then((_) => res.send({ db: true, server: true }))
        .catch(() => res.send({ db: false, server: false }));
})