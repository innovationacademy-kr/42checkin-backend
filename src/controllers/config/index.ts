import * as configService from '@service/config.service';
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@modules/error';

export const getConfig = catchAsync(async (req: Request<{}, {}, {}, { date: string }>, res: Response, next: NextFunction) => {
	const setting = await configService.getConfig(req.query.date);
	res.status(200).json(setting)
});

export const setConfig = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const setting = await configService.setConfig(req.body);
	res.status(200).json(setting)
});
