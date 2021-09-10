import passport from 'passport';
import { JwtStrategy } from '@strategy/jwt.strategy';
import { Router } from 'express';
import * as checkController from '@controllers/user/check';
import { GuestWiFiIpFilter } from 'src/middlewares/ipFilter';

export const path = '/';
export const router = Router();

passport.use(JwtStrategy());
router.use(GuestWiFiIpFilter());
router.post('/checkIn/:cardid', passport.authenticate('jwt'), checkController.checkIn);
router.post('/checkOut', passport.authenticate('jwt'), checkController.checkOut);
