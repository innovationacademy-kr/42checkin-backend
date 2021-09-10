import { Request, Response, NextFunction } from 'express';
import * as logService from '@service/log.service';
import { CLUSTER_CODE } from '@modules/cluster';
import { catchAsync } from '@modules/error';

export const getUserLog = catchAsync(async (req: Request<{login: string}, {}, {}, { page: string, listSize: string }>, res: Response) => {
	const login = req.params.login;
	const page = req.query.page ? parseInt(req.query.page) : 1;
	const listSize = parseInt(req.query.listSize);
	const result = await logService.getUserLog(login, page, listSize);
	res.json(result).status(200);
});

export const getCardLog = catchAsync(async (req: Request<{id: string}, {}, {}, { page: string, listSize: string }>, res: Response) => {
	const id = parseInt(req.params.id);
	const page = parseInt(req.query.page);
	const listSize = parseInt(req.query.listSize);
	const result = await logService.getCardLog(id, page, listSize);
	res.json(result).status(200);
});

export const getGaepoLog = catchAsync(async (req: Request<{type: string}, {}, {}, { page: string, listSize: string }>, res: Response) => {
	const page = parseInt(req.query.page);
	const listSize = parseInt(req.query.listSize);
	const result = await logService.getCluster(CLUSTER_CODE.gaepo, page, listSize);
	res.json(result).status(200);
});

export const getSeochoLog = catchAsync(async (req: Request<{type: string}, {}, {}, { page: string, listSize: string }>, res: Response) => {
	const page = parseInt(req.query.page);
	const listSize = parseInt(req.query.listSize);
	const result = await logService.getCluster(CLUSTER_CODE.seocho, page, listSize);
	res.json(result).status(200);
});

export const getCheckInUsers = catchAsync(async (req: Request<{type: string}, {}, {}, { page: string, listSize: string }>, res: Response) => {
	const type = parseInt(req.params.type);
	const page = parseInt(req.query.page);
	const listSize = parseInt(req.query.listSize);
	const result = await logService.getCheckIn(type, page, listSize);
	res.json(result).status(200);
});

export const getAllCardLog = catchAsync(async (req: Request<{type: string}, {}, {}, { page: string, listSize: string }>, res: Response) => {
	const type = parseInt(req.params.type);
	const page = parseInt(req.query.page);
	const listSize = parseInt(req.query.listSize);
	const result = await logService.getAllCard(type, page, listSize);
	res.json(result).status(200);
});
