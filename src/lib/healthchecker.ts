import { createTerminus } from '@godaddy/terminus';
import App from 'src/app';
import { dbConnection } from 'src/database';
import { createConnection } from 'typeorm';

async function onSignal() {
	console.log('server is starting cleanup');
	(await createConnection(dbConnection)).close();
	// start cleanup of resource, like databases or file descriptors
}

function onHealthCheck() {
	// checks if the system is healthy, like the db connection is live
	// resolves, if health, rejects if not
	return new Promise(async (res, rej) => {
		if (App.dbConnectionState.isConnected) {
			res({
				db: true,
				server: true,
			});
		} else {
			res({
				db: false,
				server: false,
			});
		}
		// await createConnection(dbConnection).then(() => {
		// 	try {
		// 		console.log('🚀 db connected');
		// 		res({dbconnect: true});
		// 	} catch (error) {
		// 		console.log(error);
		// 		this.logger.error(error);
		// 		res({dbconnect: false});
		// 	}
		// });
	});
}

export const connectTerminus = (server: Express.Application) => {
	createTerminus(server, {
		signal: 'SIGINT',
		healthChecks: { '/health': onHealthCheck },
		onSignal
	});
};
