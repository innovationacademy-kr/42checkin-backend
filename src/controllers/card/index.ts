import { Request, Response, NextFunction } from 'express';
import cardService from '@service/card.service';
import logger from '@lib/logger';

const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = await cardService.getAll();
		res.json(data);
	} catch (error) {
		logger.error(error);
	}
}

const getUsingInfo = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = await cardService.getUsingInfo();
		res.json(data);
	} catch (error) {
		logger.error(error);
	}
}

const getUsingCard = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = await cardService.getUsingCard();
		res.json(data);
	} catch (error) {
		logger.error(error);
	}
}

const releaseCard = async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params;
	try {
		const data = await cardService.releaseCard(parseInt(id));
		res.json(data);
	} catch (error) {
		logger.error(error);
		res.json(false);
	}
}

/**
 * 카드를 생성합니다.
 */
const createCard = async (req: Request, res: Response, next: NextFunction) => {
	const { params: { type } } = req;
	const { start, end } = req.query as { start: string; end: string };
	const user = req.user as any;
	const result = await cardService.createCard(user._id, start, end, type);
	res.json(result);
}

/**
 * 카드가 사용 중인지 혹은 존재하는지 확인합니다.
 * @returns using : true // 카드가 존재하지 않거나 사용 중일때 -> 나머지는 false
 */
const validation = async (req: Request, res: Response, next: NextFunction) => {
	const { id: cardId } = req.params;
	const using = await cardService.validCheck(cardId);
	res.json(using);
}

export default {
	getAll,
	getUsingInfo,
	getUsingCard,
	releaseCard,
	createCard,
	validation,
}
