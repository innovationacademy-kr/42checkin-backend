import { createTerminus } from '@godaddy/terminus';
import { dbConnectionState } from 'src/app';
import { dbConnection } from '@config/database';
import { createConnection } from 'typeorm';

async function onSignal() {
	console.log('server is starting cleanup');
	(await createConnection(dbConnection)).close();
}

function onHealthCheck() {
	return new Promise(async (res, rej) => {
		if (dbConnectionState.isConnected) {
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
		healthChecks: { '/healthCheck': onHealthCheck },
		onSignal
	});
};
