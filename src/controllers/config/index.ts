import { Request, Response, NextFunction, Router } from 'express';
import configService from '@service/config.service';
import { catchAsync } from 'src/middlewares/error';

const getConfig = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const setting = await configService.getConfig();
	res.status(200).json(setting)
});

const setConfig = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const setting = await configService.setConfig(req.body.capacity);
	res.status(200).json(setting)
});

export default {
	getConfig,
	setConfig
}