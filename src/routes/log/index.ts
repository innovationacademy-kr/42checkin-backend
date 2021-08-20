import { Router } from 'express';
import * as logController from '@controllers/log';

export const router = Router();
export const path = '/log';

router.get('/card/:id', logController.getCardLog);
router.get('/all', logController.getAll);
router.get('/gaepo', logController.getGaepoLog);
router.get('/user/:login', logController.getUserLog);
router.get('/seocho', logController.getSeochoLog);
router.get('/CheckIn/:type', logController.getCheckInUsers);
router.get('/allCard/:type', logController.getAllCardLog);
