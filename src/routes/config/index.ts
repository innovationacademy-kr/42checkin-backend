import { Router } from 'express';
import configController from '@controllers/config'

const path = '/config';
const router = Router();

router
	.get('/', configController.getConfig)
	.patch('/', configController.setConfig);

export default {
	router,
	path
};