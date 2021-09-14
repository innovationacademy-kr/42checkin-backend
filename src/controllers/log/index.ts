import { Request, Response, NextFunction } from 'express';
import * as logService from '@service/log.service';
import { CLUSTER_CODE } from '../../enum/cluster';
import { catchAsync } from 'src/middlewares/error';
import logger from '@lib/logger';
import httpStatus from 'http-status';

const STATUS_OK = httpStatus.OK;
export const getUserLog = catchAsync(async (req: Request<{ login: string }, {}, {}, { page: string, listSize: string }>, res: Response) => {
	const login = req.params.login;
	const page = req.query.page ? parseInt(req.query.page) : 1;
	const listSize = parseInt(req.query.listSize);
	const body = await logService.getUserLog(login, page, listSize);
	logger.logginResponse({ body, statusCode: STATUS_OK })
	res.json(body).status(STATUS_OK);
});

export const getCardLog = catchAsync(async (req: Request<{ id: string }, {}, {}, { page: string, listSize: string }>, res: Response) => {
	const id = parseInt(req.params.id);
	const page = parseInt(req.query.page);
	const listSize = parseInt(req.query.listSize);
	const body = await logService.getCardLog(id, page, listSize);
	logger.logginResponse({ body, statusCode: STATUS_OK })
	res.json(body).status(STATUS_OK);
});

export const getGaepoLog = catchAsync(async (req: Request<{ type: string }, {}, {}, { page: string, listSize: string }>, res: Response) => {
	const page = parseInt(req.query.page);
	const listSize = parseInt(req.query.listSize);
	const body = await logService.getCluster(CLUSTER_CODE.gaepo, page, listSize);
	logger.logginResponse({ body, statusCode: STATUS_OK })
	res.json(body).status(STATUS_OK);
});

export const getSeochoLog = catchAsync(async (req: Request<{ type: string }, {}, {}, { page: string, listSize: string }>, res: Response) => {
	const page = parseInt(req.query.page);
	const listSize = parseInt(req.query.listSize);
	const body = await logService.getCluster(CLUSTER_CODE.seocho, page, listSize);
	logger.logginResponse({ body, statusCode: STATUS_OK })
	res.json(body).status(STATUS_OK);
});

export const getCheckInUsers = catchAsync(async (req: Request<{ type: string }, {}, {}, { page: string, listSize: string }>, res: Response) => {
	const type = parseInt(req.params.type);
	const page = parseInt(req.query.page);
	const listSize = parseInt(req.query.listSize);
	const body = await logService.getCheckIn(type, page, listSize);
	logger.logginResponse({ body, statusCode: STATUS_OK })
	res.json(body).status(STATUS_OK);
});

export const getAllCardLog = catchAsync(async (req: Request<{ type: string }, {}, {}, { page: string, listSize: string }>, res: Response) => {
	const type = parseInt(req.params.type);
	const page = parseInt(req.query.page);
	const listSize = parseInt(req.query.listSize);
	const body = await logService.getAllCard(type, page, listSize);
	logger.logginResponse({ body, statusCode: STATUS_OK })
	res.json(body).status(STATUS_OK);
});
