import { ConnectionOptions } from 'typeorm';
import config from '@config/configuration';
import Config from '@entities/config.entity';
import User from '@entities/user.entity';
import Card from '@entities/card.entity';
import Log from '@entities/log.entity';
import Sequelize from 'sequelize';
import logger from '@lib/logger';
import CardModel from '../model/card';

export const dbConnection: ConnectionOptions = {
	type: 'mysql',
	port: config.database.port,
	host: config.database.host,
	username: config.database.username,
	password: config.database.password,
	database: config.database.name,
	synchronize: false,
	logging: config.env === 'devtest' ? false : true,
	entities: [ User, Card, Log, Config ]
};

const { host, username, password, name, port } = config.database;
const sequelize = new Sequelize.Sequelize(name, username, password, {
  host: host,
  dialect: 'mysql',
  port,
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    freezeTableName: true,
  },
  logQueryParameters: process.env.NODE_ENV === 'development',
  logging: (query, time) => {
    logger.info(time + 'ms' + ' ' + query);
  }
});

sequelize.authenticate();

const DB = {
  sequelize, // connection instance (RAW queries)
  card: CardModel(sequelize),
};

export default DB;
