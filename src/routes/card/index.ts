import { Router } from 'express';
import passport from 'passport';
import { JwtStrategy } from '@modules/jwt.strategy';
import * as cardControler from '@controllers/card';

export const router = Router();
export const path = '/card';
JwtStrategy();

router.post('/create/:type', passport.authenticate('jwt'), cardControler.createCard);
router.get('/valid/:id', cardControler.validation);
router.get('/using', cardControler.getUsingInfo);
router.get('/usingCard', cardControler.getUsingCard);
router.post('/release/:id', cardControler.releaseCard);

