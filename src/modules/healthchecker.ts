import { createTerminus } from '@godaddy/terminus';

async function onSignal() {
    // FIXME:
	/*console.log('server is starting cleanup');
	(await dbConnectionState.close());*/
}

function onHealthCheck() {
    // FIXME:
	/*return dbConnectionState
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
		});*/
}

export const connectTerminus = (server: Express.Application) => {
    // FIXME:
	/*createTerminus(server, {
		signal: 'SIGINT',
		healthChecks: { '/healthCheck': onHealthCheck },
		onSignal
	});*/
};
