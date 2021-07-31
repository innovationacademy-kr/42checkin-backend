import { Request, Response, NextFunction } from 'express';
import logService from '@service/log.service';
import { CLUSTER_CODE } from '../../enum/cluster';
import { isError } from 'src/lib/util';
import { catchAsync } from 'src/middlewares/error';

const getUserLog = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const login = req.params.login;
	const page = req.query.page ? parseInt(req.query.page as string) : 1;
	const result = await logService.getUserLog(login, page);
	res.json(result).status(200);
});

const getCardLog = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const id = parseInt(req.params.id);
	const page = parseInt(req.query.page as string);
	const result = await logService.getCardLog(id, page);
	res.json(result).status(200);
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const result = await logService.getAll();
	res.json(result).status(200);
});

const getGaepoLog = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const page = parseInt(req.query.page as string);
	const result = await logService.getCluster(CLUSTER_CODE.gaepo, page);
	res.json(result).status(200);
});

const getSeochoLog = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const page = parseInt(req.query.page as string);
	const result = await logService.getCluster(CLUSTER_CODE.seocho, page);
	res.json(result).status(200);
});

const getCheckInUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const type = parseInt(req.params.type as string);
	const result = await logService.getCheckIn(type);
	res.json(result).status(200);
});

const getAllCardLog = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const type = parseInt(req.params.type as string);
	const result = await logService.getAllCard(type);
	res.json(result).status(200);
});

export default {
	getUserLog,
	getCardLog,
	getAll,
	getGaepoLog,
	getSeochoLog,
	getCheckInUsers,
	getAllCardLog
}