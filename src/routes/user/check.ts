import passport from 'passport';
import { JwtStrategy } from '@modules/jwt.strategy';
import { Router } from 'express';
import * as checkController from '@controllers/user/check';
import { GuestWiFiIpFilter } from '@modules/ipFilter';

export const path = '/';
export const router = Router();

passport.use(JwtStrategy());
router.post('/checkIn/:cardid', GuestWiFiIpFilter, passport.authenticate('jwt'), checkController.checkIn);
router.post('/checkOut', passport.authenticate('jwt'), checkController.checkOut);
