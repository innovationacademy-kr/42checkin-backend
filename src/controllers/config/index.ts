import * as configService from '@service/config.service';
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@modules/error';
import logger from '@modules/logger';
import httpStatus from 'http-status';

export const getConfig = catchAsync(async (req: Request<{}, {}, {}, { date: string }>, res: Response, next: NextFunction) => {
    const body = await configService.getConfig(req.query.date);
    logger.logginResponse({ body, statusCode: httpStatus.OK });
    res.status(httpStatus.OK).json(body)
});

export const setConfig = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const body = await configService.setConfig(req.body);
	logger.logginResponse({ body, statusCode: httpStatus.OK });
	res.status(httpStatus.OK).json(body)
});
