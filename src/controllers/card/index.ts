import { Request, Response, NextFunction } from 'express';
import cardService from '@service/card.service';
import { catchAsync } from 'src/middlewares/error';

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const data = await cardService.getAll();
	res.json(data);
});

const getUsingInfo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const data = await cardService.getUsingInfo();
	res.json(data);
});

const getUsingCard = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const data = await cardService.getUsingCard();
	res.json(data);
});

const releaseCard = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const data = await cardService.releaseCard(parseInt(req.params.id));
	res.json(data);
});

const createCard = catchAsync(async (req: Request<{type: number}, {}, {}, { start: number; end: number }>, res: Response, next: NextFunction) => {
	const { params: { type } } = req;
	const { start, end } = req.query;
	const user = req.user.jwt;
	const result = await cardService.createCard(user, start, end, type);
	res.json(result);
});

const validation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const { id: cardId } = req.params;
	const using = await cardService.validCheck(cardId);
	res.json(using);
});

export default {
	getAll,
	getUsingInfo,
	getUsingCard,
	releaseCard,
	createCard,
	validation
};
