import BaseRoute from '../baseRoute';
import { Request, Response, NextFunction, query } from 'express';
import { LogService } from '@service/log.service';
import { CLUSTER_CODE } from '../../enum/cluster';
import { isError } from 'src/lib/util';

export default class checkLog extends BaseRoute {
	public static path = '';
	private static instance: checkLog;
	private constructor() {
		super();
		this.init();
	}

	static get router() {
		if (!checkLog.instance) {
			checkLog.instance = new checkLog();
		}
		return checkLog.instance.router;
	}

	private init() {
		this.router.get('/card/:id', this.getCardLog);
		this.router.get('/all', this.getAll);
		this.router.get('/gaepo', this.getGaepoLog);
		this.router.get('/user/:login', this.getUserLog);
		this.router.get('/seocho', this.getSeochoLog);
		this.router.get('/CheckIn/:type', this.getCheckInUsers);
		this.router.get('/allCard/:type', this.getAllCardLog);
	}

	async getUserLog(req: Request, res: Response, next: NextFunction) {
		try {
			const login = req.params.login;
			const page = req.query.page ? parseInt(req.query.page as string) : 1;
			const result = await LogService.service.getUserLog(login, page);
			if (isError(result)) {
				res.json([]).status(400);
			} else {
				res.json(result).status(200);
			}
		} catch (error) {
			res.json({result: false}).status(400);
		}
  	}
	async getCardLog(req: Request, res: Response, next: NextFunction) {
		const id = parseInt(req.params.id);
		const page = parseInt(req.query.page as string);
    	const result = await LogService.service.getCardLog(id, page);
		if (isError(result)) {
			res.json(null).status(400);
		} else {
			res.json(result).status(200);
		}
  	}
	async getAll(req: Request, res: Response, next: NextFunction) {
		console.log('asd');
	    const result = await LogService.service.getAll();

		if (isError(result)) {
			res.json(null).status(400);
		} else {
			res.json(result).status(200);
		}
  	}
	async getGaepoLog(req: Request, res: Response, next: NextFunction) {
		const page = parseInt(req.query.page as string);
    	const result = await LogService.service.getCluster(CLUSTER_CODE.gaepo, page);
		if (isError(result)) {
			res.json(null).status(400);
		} else {
			res.json(result).status(200);
		}
	}
	async getSeochoLog(req: Request, res: Response, next: NextFunction) {
		const page = parseInt(req.query.page as string);
    	const result = await LogService.service.getCluster(CLUSTER_CODE.seocho, page);
		if (isError(result)) {
			res.json(null).status(400);
		} else {
			res.json(result).status(200);
		}
	}
	async getCheckInUsers(req: Request, res: Response, next: NextFunction) {
		const type = parseInt(req.params.type as string);
    	const result = await LogService.service.getCheckIn(type);
		if (isError(result)) {
			res.json(null).status(400);
		} else {
			res.json(result).status(200);
		}
	}
	async getAllCardLog(req: Request, res: Response, next: NextFunction) {
		const type = parseInt(req.params.type as string);
    	const result = await LogService.service.getAllCard(type);
		if (isError(result)) {
			res.json(null).status(400);
		} else {
			res.json(result).status(200);
		}
  	}
}
