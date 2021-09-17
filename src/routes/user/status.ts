import { Router } from 'express';
import passport from 'passport';
import { JwtStrategy } from '@modules/jwt.strategy';
import * as userStatusController from '@controllers/user/status';

export const path = '';
export const router = Router();
passport.use(JwtStrategy());
router.get('/status', passport.authenticate('jwt'), userStatusController.status);
router.get('/using', userStatusController.usingStaus);
router.post('/forceCheckout/:userId', passport.authenticate('jwt'), userStatusController.forceCheckout);