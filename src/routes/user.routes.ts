import { Router } from 'express';
import passport from 'passport';
import env from '@modules/env';
import * as Login from '@controllers/user/login';
import * as Status from '@controllers/user/status';
import * as Check from '@controllers/user/check';
import { GuestWiFiIpFilter } from '@modules/ipFilter';
import { JwtStrategy } from '@modules/jwt.strategy';
import Strategy42 from '@modules/ft.strategy';

export const path = '/user';
export const router = Router();
const passportOptions = { failureRedirect: env.url.client + '/' };
passport.use(JwtStrategy());
passport.use(Strategy42());


router.get('/login/', Login.login, passport.authenticate('42', passportOptions));
router.get('/login/callback', passport.authenticate('42', passportOptions), Login.callback);
router.post('/checkIn/:cardid', GuestWiFiIpFilter, passport.authenticate('jwt'), Check.checkIn);
router.post('/checkOut', passport.authenticate('jwt'), Check.checkOut);
router.get('/status', passport.authenticate('jwt'), Status.status);
router.get('/using', Status.usingStaus);
router.post('/forceCheckout/:userId', passport.authenticate('jwt'), Status.forceCheckout);