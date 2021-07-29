import passport from 'passport';
import { JwtStrategy } from '@strategy/jwt.strategy';
import { Router } from 'express';
import checkController from '@controllers/user/check';

const path = '/';
const router = Router();
passport.use(JwtStrategy());

router.post('/checkIn/:cardId', passport.authenticate('jwt'), (req, res, next) => checkController.checkIn(req, res, next));
router.post('/checkOut', passport.authenticate('jwt'), (req, res, next) => checkController.checkOut(req, res, next));

export default {
	router,
	path
}