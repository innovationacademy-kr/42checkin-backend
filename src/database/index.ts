import { ConnectionOptions } from 'typeorm';
import config from '@config/configuration';
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
	// TODO 테이블이 초기에 한번 다 초기화되는건데 이렇게 하는게 맞는건가?
	synchronize: false,
	// synchronize: config.env === 'production' ? false : true,
	logging: true,
	entities: [ User, Card, Log ]
};
