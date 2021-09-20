import { Router } from "express";

import * as userRouter from '@routes/user.routes'
import * as configRouter from '@routes/config.routes'
import * as historyRouter from '@routes/history.routes';
import { Sequelize } from "@models/index";

export const router = Router();
export const path = '';

router.use(userRouter.path, userRouter.router);
router.use(historyRouter.path, historyRouter.router);
router.use(configRouter.path, configRouter.router);
router.get('/healthCheck', (req, res, next) => {
    Sequelize().sync({ force: false })
        .then((_) => res.send({ db: true, server: true }))
        .catch(() => res.send({ db: false, server: false }));
})