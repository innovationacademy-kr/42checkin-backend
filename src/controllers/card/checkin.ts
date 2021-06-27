import BaseRoute from '../baseRoute';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { CardService } from '@service/card.service';
import { JwtStrategy } from '@strategy/jwt.strategy';
import { MyLogger } from '../../service/logger.service';

export default class CheckIn extends BaseRoute {
	public static path = '';
	private static instance: CheckIn;
	private logger: MyLogger;
	private constructor() {
		super();
		passport.use(JwtStrategy());
		this.init();
		this.logger = new MyLogger();
	}

	static get router() {
		if (!CheckIn.instance) {
			CheckIn.instance = new CheckIn();
		}
		return CheckIn.instance.router;
	}

	private init() {
		this.router.post('/create/:type', passport.authenticate('jwt'), (req, res, next) =>
			this.createCard(req, res, next)
		);
		this.router.get('/valid/:id', this.validation);
		this.router.get('/all', this.getAll);
		this.router.get('/using', this.getUsingInfo);
		this.router.get('/usingCard', this.getUsingCard);
		this.router.post('/release/:id', this.releaseCard);
	}

	async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const data = await CardService.service.getAll();
			res.json(data);
		} catch (error) {
			this.logger.error(error);
		}
	}

	async getUsingInfo(req: Request, res: Response, next: NextFunction) {
		try {
			const data = await CardService.service.getUsingInfo();
			res.json(data);
		} catch (error) {
			this.logger.error(error);
		}
	}

	async getUsingCard(req: Request, res: Response, next: NextFunction) {
		try {
			const data = await CardService.service.getUsingCard();
			res.json(data);
		} catch (error) {
			this.logger.error(error);
		}
	}

	async releaseCard(req: Request, res: Response, next: NextFunction) {
		const { id } = req.params;
		try {
			const data = await CardService.service.releaseCard(parseInt(id));
			res.json(data);
		} catch (error) {
			this.logger.error(error);
			res.json(false);
		}
	}

	/**
	 * 카드를 생성합니다.
	 */
	private async createCard(req: Request, res: Response, next: NextFunction) {
		const { params: { type } } = req;
		const { start, end } = req.query as { start: string; end: string };
		const user = req.user as any;
		const result = await CardService.service.createCard(user._id, start, end, type);
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
