import passport from 'passport';
import Strategy42 from '@modules/ft.strategy';
import env from '@modules/env';
import { Router } from 'express';
import * as userController from '@controllers/user/login';

export const path = '/login';
export const router = Router();
passport.use(Strategy42());
const passportOptions = { failureRedirect: env.url.client + '/' };

router.get('/', passport.authenticate('42', passportOptions));
router.get('/callback', passport.authenticate('42', passportOptions), userController.callback);
