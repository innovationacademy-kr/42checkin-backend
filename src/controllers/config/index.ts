import { Request, Response, NextFunction, Router } from 'express';
import * as configService from '@service/config.service';
import { catchAsync } from 'src/middlewares/error';

export const getConfig = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const setting = await configService.getConfig();
	res.status(200).json(setting)
});

export const setConfig = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const setting = await configService.setConfig(req.body.capacity);
	res.status(200).json(setting)
});
