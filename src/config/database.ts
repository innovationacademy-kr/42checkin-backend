import { ConnectionOptions } from 'typeorm';
import config from '@config/configuration';
import Config from '@entities/config.entity';
import User from '@entities/user.entity';
import Card from '@entities/card.entity';
import Log from '@entities/log.entity';

export const dbConnection: ConnectionOptions = {
	type: 'mysql',
	port: config.database.port,
	host: config.database.host,
	username: config.database.username,
	password: config.database.password,
	database: config.database.name,
	synchronize: false,
	// synchronize: config.env === 'production' ? false : true,
	logging: true,
	entities: [ User, Card, Log, Config ]
};
