import passport from 'passport';
import { JwtStrategy } from '@strategy/jwt.strategy';
import { Router } from 'express';
import checkController from '@controllers/user/check';

const path = '/';
const router = Router();
passport.use(JwtStrategy());

router.post('/checkIn/:cardid', passport.authenticate('jwt'), checkController.checkIn);
router.post('/checkOut', passport.authenticate('jwt'), checkController.checkOut);

export default {
	router,
	path
}