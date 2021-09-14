import { Request, Response, NextFunction, Router } from 'express';
import * as configService from '@service/config.service';
import { catchAsync } from 'src/middlewares/error';
import logger from '@lib/logger';
import httpStatus from 'http-status';

export const getConfig = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const body = await configService.getConfig();
	logger.logginResponse({ body, statusCode: httpStatus.OK });
	res.status(httpStatus.OK).json(body)
});

export const setConfig = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const body = await configService.setConfig(req.body);
	logger.logginResponse({ body, statusCode: httpStatus.OK });
	res.status(httpStatus.OK).json(body)
});
