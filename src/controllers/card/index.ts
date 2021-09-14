import { Request, Response, NextFunction } from 'express';
import * as cardService from '@service/card.service';
import { catchAsync } from 'src/middlewares/error';
import logger from '@lib/logger';
import httpStatus from 'http-status';

const STATUS_OK = httpStatus.OK;

export const getUsingInfo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const body = await cardService.getUsingInfo();
	logger.logginResponse({ body, statusCode: STATUS_OK })
	res.status(STATUS_OK).json(body);
});

export const getUsingCard = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const body = await cardService.getUsingCard();
	logger.logginResponse({ body, statusCode: STATUS_OK })
	res.status(STATUS_OK).json(body);
});

export const releaseCard = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const body = await cardService.releaseCard(parseInt(req.params.id));
	logger.logginResponse({ body, statusCode: STATUS_OK })
	res.status(STATUS_OK).json(body);
});

export const createCard = catchAsync(async (req: Request<{type: number}, {}, {}, { start: number; end: number }>, res: Response, next: NextFunction) => {
	const { params: { type } } = req;
	const { start, end } = req.query;
	const user = req.user.jwt;
	const body = await cardService.createCard(user, start, end, type);
	logger.logginResponse({ body, statusCode: STATUS_OK })
	res.status(STATUS_OK).json(body);
});

export const validation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const { id: cardId } = req.params;
	const body = await cardService.validCheck(cardId);
	logger.logginResponse({ body, statusCode: STATUS_OK })
	res.status(STATUS_OK).json(body);
});
