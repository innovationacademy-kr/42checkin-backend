import { Router } from 'express';
import passport from 'passport';
import { JwtStrategy } from '@strategy/jwt.strategy';
import cardControler from '@controllers/card';

const router = Router();
const path = '/card';
JwtStrategy();

router.post('/create/:type', passport.authenticate('jwt'), cardControler.createCard);
router.get('/valid/:id', cardControler.validation);
router.get('/all', cardControler.getAll);
router.get('/using', cardControler.getUsingInfo);
router.get('/usingCard', cardControler.getUsingCard);
router.post('/release/:id', cardControler.releaseCard);

export default {
	router, path
};
