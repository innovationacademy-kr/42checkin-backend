import passport from 'passport';
import Strategy42 from '@strategy/ft.strategy';
import config from '@config/configuration';
import { Router } from 'express';
import userController from '@controllers/user/login';

const path = '/login';
const router = Router();
passport.use(Strategy42());
const passportOptions = { failureRedirect: config.url.client + '/' };

router.get('/', passport.authenticate('42', passportOptions));
router.get('/callback', passport.authenticate('42', passportOptions), userController.callback);

export default {
	router,
	path
};
