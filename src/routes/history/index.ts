import { Router } from 'express';
import * as historyController from '@controllers/history';

export const router = Router();
export const path = '/log';

router.get('/card/:id', historyController.getCardHistory);
router.get('/user/:login', historyController.getUserHistory);
router.get('/gaepo', historyController.getGaepoHistory);
router.get('/seocho', historyController.getSeochoHistory);
router.get('/CheckIn/:type', historyController.getCheckInUsers);
