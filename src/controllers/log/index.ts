import { Request, Response, NextFunction } from 'express';
import logService from '@service/log.service';
import { CLUSTER_CODE } from '../../enum/cluster';
import { isError } from 'src/lib/util';

const getUserLog = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const login = req.params.login;
		const page = req.query.page ? parseInt(req.query.page as string) : 1;
		const result = await logService.getUserLog(login, page);
		if (isError(result)) {
			res.json([]).status(400);
		} else {
			res.json(result).status(200);
		}
	} catch (error) {
		res.json({ result: false }).status(400);
	}
}

const getCardLog = async (req: Request, res: Response, next: NextFunction) => {
	const id = parseInt(req.params.id);
	const page = parseInt(req.query.page as string);
	const result = await logService.getCardLog(id, page);
	if (isError(result)) {
		res.json(null).status(400);
	} else {
		res.json(result).status(200);
	}
}

const getAll = async (req: Request, res: Response, next: NextFunction) => {
	const result = await logService.getAll();

	if (isError(result)) {
		res.json(null).status(400);
	} else {
		res.json(result).status(200);
	}
}

const getGaepoLog = async (req: Request, res: Response, next: NextFunction) => {
	const page = parseInt(req.query.page as string);
	const result = await logService.getCluster(CLUSTER_CODE.gaepo, page);
	if (isError(result)) {
		res.json(null).status(400);
	} else {
		res.json(result).status(200);
	}
}

const getSeochoLog = async (req: Request, res: Response, next: NextFunction) => {
	const page = parseInt(req.query.page as string);
	const result = await logService.getCluster(CLUSTER_CODE.seocho, page);
	if (isError(result)) {
		res.json(null).status(400);
	} else {
		res.json(result).status(200);
	}
}

const getCheckInUsers = async (req: Request, res: Response, next: NextFunction) => {
	const type = parseInt(req.params.type as string);
	const result = await logService.getCheckIn(type);
	if (isError(result)) {
		res.json(null).status(400);
	} else {
		res.json(result).status(200);
	}
}

const getAllCardLog = async (req: Request, res: Response, next: NextFunction) => {
	const type = parseInt(req.params.type as string);
	const result = await logService.getAllCard(type);
	if (isError(result)) {
		res.json(null).status(400);
	} else {
		res.json(result).status(200);
	}
}

export default {
	getUserLog,
	getCardLog,
	getAll,
	getGaepoLog,
	getSeochoLog,
	getCheckInUsers,
	getAllCardLog
}