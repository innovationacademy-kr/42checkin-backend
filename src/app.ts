import express from 'express';
import cookieParser from 'cookie-parser';
import * as requestIp from 'request-ip';
import cors from 'cors';
import rTracer from 'cls-rtracer';

import { Connection, createConnection } from 'typeorm';
import DB, { dbConnection } from './config/database';
import * as Api from '@routes/api';
import config from '@config/configuration';
import passport from 'passport';
import logger from './lib/logger';
import { connectTerminus } from './lib/healthchecker';
import { errorConverter, errorHandler } from './middlewares/error';

export let dbConnectionState: Connection;
const port = config.port || 3000;
const env = config.env || 'development';
export const app = express();

function getOrigin() {
	const origin = [config.url.client];
	if (config.env === 'production') {
		origin.push(config.url.client_old);
	}
	return origin;
}

const connection = createConnection(dbConnection);
connection.then((v) => {
	try {
		console.log('🚀 db connected');
		dbConnectionState = v;
		app.emit('dbconnected')
	} catch (error) {
		logger.error(error);
	}
});
DB.sequelize.sync({ force: false }).then(() => {
	try {
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
	logger.info(`${req.method} ${req.path}`, req.headers);
	next();
});
app.use(Api.path, Api.router);
app.use(errorConverter);
app.use(errorHandler);
const server = app.listen(port, () => {
	console.log(`=================================`);
	console.log(`======= ENV: ${env} =============`);
	console.log(`🚀 App listening on the port ${port}`);
	console.log(`=================================`); 1
});
connectTerminus(server);
