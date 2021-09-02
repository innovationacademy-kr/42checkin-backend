import { Router } from 'express';
import * as configController from '@controllers/config'

export const path = '/config';
export const router = Router();

router
	.get('/', configController.getConfig)
	.put('/', configController.setConfig);
