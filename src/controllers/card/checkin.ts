import BaseRoute from '../baseRoute';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { CardService } from '@service/card.service';
import { JwtStrategy } from '@strategy/jwt.strategy';

export default class CheckIn extends BaseRoute {
	public static path = '';
	private static instance: CheckIn;
	private constructor() {
		super();
		passport.use(JwtStrategy());
		this.init();
	}

	static get router() {
		if (!CheckIn.instance) {
			CheckIn.instance = new CheckIn();
		}
		return CheckIn.instance.router;
	}

	private init() {
		this.router.post('/create/:type', passport.authenticate('jwt'), (req,res, next) => this.createCard(req,res, next));
		this.router.get('/valid/:id', this.validation);
	}

	/**
	 * 카드를 생성합니다.
	 */
	private async createCard(req: Request, res: Response, next: NextFunction) {
		const { params: { type } } = req;
		const { start, end } = req.query as {start: string, end: string};
		const user = req.user as any;
		const result =  await CardService.service.createCard(user._id, start, end, type);
		res.json(result);
	}

	/**
	 * 카드가 사용 중인지 혹은 존재하는지 확인합니다.
	 * @returns using : true // 카드가 존재하지 않거나 사용 중일때 -> 나머지는 false
	 */
	private async validation(req: Request, res: Response, next: NextFunction) {
		const { id: cardId } = req.params;
		const using = await CardService.service.validCheck(cardId);
		res.json(using);
	}
}
