import { createTerminus } from '@godaddy/terminus';
import App from 'src/app';
import { dbConnection } from 'src/database';
import { createConnection } from 'typeorm';

async function onSignal() {
	console.log('server is starting cleanup');
	(await createConnection(dbConnection)).close();
}

function onHealthCheck() {
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
	});
}

export const connectTerminus = (server: Express.Application) => {
	createTerminus(server, {
		signal: 'SIGINT',
		healthChecks: { '/health': onHealthCheck },
		onSignal
	});
};
