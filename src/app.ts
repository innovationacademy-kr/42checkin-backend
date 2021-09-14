import express from 'express';
import cookieParser from 'cookie-parser';
import * as requestIp from 'request-ip';
import cors from 'cors';
import rTracer from 'cls-rtracer';

import DB from './config/database';
import * as Api from '@routes/api';
import config from '@config/configuration';
import passport from 'passport';
import logger from './lib/logger';
import { connectTerminus } from './lib/healthchecker';
import { errorConverter, errorHandler } from './middlewares/error';
import { Sequelize } from 'sequelize/types';

export let dbConnectionState: Sequelize;
const port = config.port || 3000;
const env = config.env || 'development';
export const app = express();

function getOrigin() {
	const origin = [config.url.client, config.url.admin];
	if (config.env === 'production') {
		origin.push(config.url.client_old);
	}
	return origin;
}

DB.sequelize.sync({ force: false }).then((v) => {
	try {
		dbConnectionState = v;
		app.emit('dbconnected')
		console.log('🚀 db connected');
	} catch (error) {
		logger.error(error);
	}
});
app.use(cookieParser());
app.use(express.json());
app.use(requestIp.mw());
app.use(passport.initialize());
app.use(passport.session());
app.use(rTracer.expressMiddleware());
app.use(cors({ origin: getOrigin(), credentials: true }));
app.use((req, res, next) => {
	const { method, path, url, query, headers: { cookie }, body } = req;
	const request = { method, path, cookie, body, url, query };
	logger.info({ request });
	next();
});
app.use(Api.path, Api.router);
app.use(errorConverter);
app.use(errorHandler);
const server = app.listen(port, () => {
	console.log(`=================================`);
	console.log(`======= ENV: ${env} =============`);
	console.log(`🚀 App listening on the port ${port}`);
	console.log(`=================================`);
});
connectTerminus(server);
