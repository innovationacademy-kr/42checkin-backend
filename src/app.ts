import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rTracer from 'cls-rtracer';
import env from '@modules/env';
import passport from 'passport';
import logger from './modules/logger';

import * as requestIp from 'request-ip';
import * as Api from '@routes/api';

import {errorConverter, errorHandler} from '@modules/error';
import {Sequelize} from './models';

const port = env.port || 3000;
export const app = express();

function getOrigin() {
	const origin = [env.url.client, env.url.admin];
	if (env.node_env === 'production') {
		origin.push(env.url.client_old);
	}
	return origin;
}

Sequelize().sync({force: false})
    .then((v) => {
        try {
            app.emit('dbconnected')
            console.log('🚀 db connected');
        } catch (error) {
            logger.error(error);
        }
    })
    .catch(err => {
        console.log(err);
        throw err
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
	console.log(`======= ENV: ${env.node_env} =============`);
	console.log(`🚀 App listening on the port ${port}`);
	console.log(`=================================`);
});
