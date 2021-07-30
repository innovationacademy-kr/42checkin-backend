import express from 'express';
import cookieParser from 'cookie-parser';
import * as requestIp from 'request-ip';
import cors from 'cors';
import rTracer from 'cls-rtracer';

import { Connection, createConnection } from 'typeorm';
import { dbConnection } from './config/database';
import Api from '@routes/api';
import config from '@config/configuration';
import passport from 'passport';
import logger from './lib/logger';
import { connectTerminus } from './lib/healthchecker';

// TODO try catch 리팩토링

export let dbConnectionState: Connection;
const port = config.port || 3000;
const env = config.env || 'development';
export const startApp = () => {
	const app = express();
	setConfig(app).then(() => {
		setRoutes(app);
	});
}

async function setConfig(app: express.Application) {
	app.use(cookieParser());
	app.use(express.json());
	app.use(requestIp.mw());
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(rTracer.expressMiddleware());

	await connectToDatabase();
	app.use(cors({ origin: getOrigin(), credentials: true }));
	app.use((req, res, next) => {
		logger.info(`${req.method} ${req.path}`, req.headers);
		next();
	});
	listen(app);
}

function listen(app: express.Application) {
	const server = app.listen(port, () => {
		console.log(`=================================`);
		console.log(`======= ENV: ${env} =======`);
		console.log(`🚀 App listening on the port ${port}`);
		console.log(`=================================`);
	});
	connectTerminus(server);
}

async function connectToDatabase() {
	const connection = createConnection(dbConnection);
	connection.then((v) => {
		try {
			dbConnectionState = v;
			console.log('🚀 db connected');
		} catch (error) {
			logger.error(error);
		}
	});
	return connection;
}

function setRoutes(app: express.Application) {
	app.use(Api.path, Api.router);
}

function getOrigin() {
	const origin = [config.url.client];
	if (config.env === 'production') {
		origin.push(config.url.client_old);
	}
	return origin;
}
