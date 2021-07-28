import express from 'express';
import cookieParser from 'cookie-parser';
import * as requestIp from 'request-ip';
import cors from 'cors';
import rTracer from 'cls-rtracer';

import { Connection, createConnection } from 'typeorm';
import { dbConnection } from './database';
import Api from '@controllers/api';
import config from '@config/configuration';
import passport from 'passport';
import logger from './lib/logger';
import moment from 'moment-timezone';
import { connectTerminus } from './lib/healthchecker';

class App {
	public app: express.Application;
	public port: string | number;
	public env: string;
	static dbConnectionState: Connection;

	constructor() {
		this.app = express();
		this.config().then(() => {
			this.routes();
		});
	}

	public async config() {
		this.port = config.port || 3000;
		this.env = config.env || 'development';

		await this.connectToDatabase();

		this.app.use(cookieParser());
		this.app.use(express.json());
		this.app.use(requestIp.mw());
		this.app.use(passport.initialize());
		this.app.use(passport.session());
		this.app.use(rTracer.expressMiddleware());

		// cors
		this.app.use(
			cors({
				origin:
					config.env === 'development' || config.env === 'test'
						? [ config.url.client ]
						: config.env === 'production' ? [ config.url.client, config.url.client_old ] : [],
				credentials: true
			})
		);

		this.app.use((req, res, next) => {
			logger.info(`${req.method} ${req.path}`, req.headers);
			next();
		});

		this.listen();
	}

	public listen() {
		const server = this.app.listen(this.port, () => {
			console.log(`=================================`);
			console.log(`======= ENV: ${this.env} =======`);
			console.log(`🚀 App listening on the port ${this.port}`);
			console.log(`=================================`);
		});
		connectTerminus(server);
	}

	private async connectToDatabase() {
		const connection = createConnection(dbConnection);
		connection.then((v) => {
			try {
				App.dbConnectionState = v;
				console.log('🚀 db connected');
			} catch (error) {
				logger.error(error);
			}
		});
		return connection;
	}

	private routes() {
		this.app.use(Api.path, Api.router);
	}
}
export default App;
