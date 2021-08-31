import { Request, Response, NextFunction } from 'express';
import * as logService from '@service/log.service';
import { CLUSTER_CODE } from '../../enum/cluster';
import { catchAsync } from 'src/middlewares/error';

export const getUserLog = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const login = req.params.login;
	const page = req.query.page ? parseInt(req.query.page as string) : 1;
	const result = await logService.getUserLog(login, page);
	res.json(result).status(200);
});

export const getCardLog = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const id = parseInt(req.params.id);
	const page = parseInt(req.query.page as string);
	const result = await logService.getCardLog(id, page);
	res.json(result).status(200);
});

export const getGaepoLog = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const page = parseInt(req.query.page as string);
	const result = await logService.getCluster(CLUSTER_CODE.gaepo, page);
	res.json(result).status(200);
});

export const getSeochoLog = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const page = parseInt(req.query.page as string);
	const result = await logService.getCluster(CLUSTER_CODE.seocho, page);
	res.json(result).status(200);
});

export const getCheckInUsers = catchAsync(async (req: Request<{type: string}, {}, {}, { page: string }>, res: Response, next: NextFunction) => {
	const type = parseInt(req.params.type as string);
	const page = parseInt(req.query.page as string);
	const result = await logService.getCheckIn(type, page);
	res.json(result).status(200);
});

export const getAllCardLog = catchAsync(async (req: Request<{type: string}, {}, {}, { page: string }>, res: Response, next: NextFunction) => {
	const type = parseInt(req.params.type as string);
	const page = parseInt(req.query.page as string);
	const result = await logService.getAllCard(type, page);
	res.json(result).status(200);
});
