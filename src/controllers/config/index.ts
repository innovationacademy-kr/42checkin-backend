import { Request, Response, NextFunction, Router } from 'express';

import configService from '@service/config.service';
const getConfig = async (req: Request, res: Response, next: NextFunction) => {
	const setting = await configService.getConfig();
	if (setting) {
		res.status(200).json(setting)
	} else {
		res.status(400).json({result: false, message: '해당 환경에 대한 설정값이 존재하지 않습니다.'})
	}
}

const setConfig = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const setting = await configService.setConfig(req.body.capacity);
		if (setting) {
			res.status(200).json(setting)
		} else {
			res.status(400).json({result: false, message: '설정값수정에 실패하였습니다.'})
		}
	} catch (error) {
		res.status(400).json({error: error.message});
	}
}

export default {
	getConfig,
	setConfig
}