import express from 'express';
import cookieParser from 'cookie-parser';
import * as requestIp from 'request-ip';
import cors from 'cors';

import { createConnection } from 'typeorm';
import { dbConnection } from './database';
import Api from '@controllers/api';
import config from '@config/configuration';
import passport from 'passport';
import { MyLogger } from './service/logger.service';

class App {
	public app: express.Application;
	public port: string | number;
	public env: string;
	private logger: MyLogger;

	constructor() {
		this.app = express();
		this.logger = new MyLogger();
		this.config().then(() => {
			this.routes();
		})
	}

	public async config() {
		this.port = config.port || 3000;
		this.env = config.env || 'development';

		await this.connectToDatabase();

		this.app.use(cookieParser());
		this.app.use(requestIp.mw());
		this.app.use(passport.initialize());
		this.app.use(passport.session());

		// cors
		this.app.use(cors({
			origin: config.env === 'development' ? 'http://localhost:3001' : 'https://cluster.42seoul.io',
			credentials: true,
		}));

		// (ex1)trace all request
		this.app.use((req, res, next) => {
			this.logger.debug(req.method, req.path);
			next();
		});
		this.listen();

	}

	public listen() {
		this.app.listen(this.port, () => {
			console.log(`=================================`);
			console.log(`======= ENV: ${this.env} =======`);
			console.log(`🚀 App listening on the port ${this.port}`);
			console.log(`=================================`);
		});
	}

	private async connectToDatabase() {
		return await createConnection(dbConnection).then((v) => {
			console.log('디비 연결완료');
			// console.log(dbConnection);
			try {
			} catch (error) {
				console.log(error);
			}
		});
	}

	private routes () {
   		this.app.use(Api.path, Api.router);
  	}
}
export default App;
