import { Request, Response, NextFunction } from 'express';
import BaseRoute from '../baseRoute';
import ConfigService from '@service/config.service';
import CardService from '@service/card.service';

export default class Config extends BaseRoute {
	public static path = '/config';
	private static instance: Config;

	private constructor() {
		super();
		this.init();
	}

	static get router() {
		if (!Config.instance) {
			Config.instance = new Config();
		}
		return Config.instance.router;
	}

	private init() {
		this.router.get('/', this.getConfig);
		this.router.patch('/', this.setConfig);
	}

	async getConfig (req: Request, res: Response, next: NextFunction) {
		const setting = await ConfigService.service.getConfig();
		if (setting) {
			res.status(200).json(setting)
		} else {
			res.status(400).json({result: false, message: '해당 환경에 대한 설정값이 존재하지 않습니다.'})
		}
	}

	async setConfig (req: Request, res: Response, next: NextFunction) {
		try {
			const setting = await ConfigService.service.setConfig(req.body.capacity);
			if (setting) {
				res.status(200).json(setting)
			} else {
				res.status(400).json({result: false, message: '설정값수정에 실패하였습니다.'})
			}
		} catch (error) {
			res.status(400).json({error: error.message});
		}
	}
}
