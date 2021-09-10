import passport from 'passport';
import { JwtStrategy } from '@strategy/jwt.strategy';
import { Router } from 'express';
import * as checkController from '@controllers/user/check';
import { ipFilter } from 'src/middlewares/ipFilter';
import config from '@config/configuration';

const ips = [config.ip.guest];
export const path = '/';
export const router = Router();

passport.use(JwtStrategy());
router.use(ipFilter(ips));
router.post('/checkIn/:cardid', passport.authenticate('jwt'), checkController.checkIn);
router.post('/checkOut', passport.authenticate('jwt'), checkController.checkOut);
