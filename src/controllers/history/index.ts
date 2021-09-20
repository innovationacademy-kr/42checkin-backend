import { Request, Response, NextFunction } from 'express';
import * as historyService from '@service/history.service';
import { CLUSTER_CODE } from '@modules/cluster';
import { catchAsync } from '@modules/error';
import logger from '@modules/logger';
import httpStatus from 'http-status';

const STATUS_OK = httpStatus.OK;
export const getUserHistory = catchAsync(async (req: Request<{ login: string }, {}, {}, { page: string, listSize: string }>, res: Response) => {
	const login = req.params.login;
	const page = req.query.page ? parseInt(req.query.page) : 1;
	const listSize = parseInt(req.query.listSize);
	const body = await historyService.getUserHistory(login, page, listSize);
	logger.logginResponse({ body, statusCode: STATUS_OK })
	res.json(body).status(STATUS_OK);
});

export const getCardHistory = catchAsync(async (req: Request<{ id: string }, {}, {}, { page: string, listSize: string }>, res: Response) => {
	const id = parseInt(req.params.id);
	const page = parseInt(req.query.page);
	const listSize = parseInt(req.query.listSize);
	const body = await historyService.getCardHistory(id, page, listSize);
	logger.logginResponse({ body, statusCode: STATUS_OK })
	res.json(body).status(STATUS_OK);
});

export const getGaepoHistory = catchAsync(async (req: Request<{ type: string }, {}, {}, { page: string, listSize: string }>, res: Response) => {
	const page = parseInt(req.query.page);
	const listSize = parseInt(req.query.listSize);
	const body = await historyService.getCluster(CLUSTER_CODE.gaepo, page, listSize);
	logger.logginResponse({ body, statusCode: STATUS_OK })
	res.json(body).status(STATUS_OK);
});

export const getSeochoHistory = catchAsync(async (req: Request<{ type: string }, {}, {}, { page: string, listSize: string }>, res: Response) => {
	const page = parseInt(req.query.page);
	const listSize = parseInt(req.query.listSize);
	const body = await historyService.getCluster(CLUSTER_CODE.seocho, page, listSize);
	logger.logginResponse({ body, statusCode: STATUS_OK })
	res.json(body).status(STATUS_OK);
});

export const getCheckInUsers = catchAsync(async (req: Request<{ type: string }, {}, {}, { page: string, listSize: string }>, res: Response) => {
	const type = parseInt(req.params.type);
	const page = parseInt(req.query.page);
	const listSize = parseInt(req.query.listSize);
	const body = await historyService.getCheckIn(type, page, listSize);
	logger.logginResponse({ body, statusCode: STATUS_OK })
	res.json(body).status(STATUS_OK);
});
