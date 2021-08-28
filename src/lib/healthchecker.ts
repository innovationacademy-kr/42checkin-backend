import { createTerminus } from '@godaddy/terminus';
import { dbConnectionState } from 'src/app';

async function onSignal() {
	console.log('server is starting cleanup');
	(await dbConnectionState.close());
}

function onHealthCheck() {
	return dbConnectionState
		.authenticate()
		.then((_) => {
			return {
				db: true,
				server: true
			};
		})
		.catch(() => {
			return {
				db: false,
				server: false
			};
		});
}

export const connectTerminus = (server: Express.Application) => {
	createTerminus(server, {
		signal: 'SIGINT',
		healthChecks: { '/healthCheck': onHealthCheck },
		onSignal
	});
};
