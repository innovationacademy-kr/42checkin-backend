import database from 'sequelize';
import type {configAttributes, configCreationAttributes} from "./config";
import type {historyAttributes, historyCreationAttributes} from "./history";
import type {usersAttributes, usersCreationAttributes} from "./users";

import {Config} from "./config";
import { History } from './history';
import {Users} from "./users";

import env from '@modules/env';
import logger from "../modules/logger";

/*
sequelize-auto -o "./models" -d checkin_dev -h localhost -u root -p  -x Daiso523! -e mysql -l ts
 */
const {host, username, password, name, port} = env.database;
const sequelize = new database.Sequelize(name, username, password, {
    host: host,
    dialect: 'mysql',
    port,
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        freezeTableName: true
    },
    timezone: '+09:00',
    logQueryParameters: process.env.NODE_ENV === 'development',
    logging: (query) => {
        logger.sql(query);
    }
});

sequelize
    .authenticate()
    .then(() => {
        logger.info('Connection has been established successfully.');
    })
    .catch(err => {
        logger.error('Unable to connect to the database:', err);
    });

export {
    Config,
    History,
    Users,
    sequelize
};

export type {
    configAttributes,
    configCreationAttributes,
    historyAttributes,
    historyCreationAttributes,
    usersAttributes,
    usersCreationAttributes,
};

export function Sequelize() {
    Config.initModel(sequelize);
    History.initModel(sequelize);
    Users.initModel(sequelize);
    History.belongsTo(Users, { foreignKey: 'login', targetKey: 'login' });
    Users.hasMany(History, { foreignKey: 'login', sourceKey: 'login' });
    return sequelize;
}
