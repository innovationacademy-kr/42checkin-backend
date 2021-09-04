import config from '@config/configuration';
import Sequelize from 'sequelize';
import logger from '@lib/logger';
import CardModel from '../model/card';
import ConfigModel from 'src/model/config';
import LogModel from 'src/model/log';
import UserModel from 'src/model/user';


const { host, username, password, name, port } = config.database;
const sequelize = new Sequelize.Sequelize(name, username, password, {
	host: host,
	dialect: 'mysql',
	port,
	define: {
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci',
		freezeTableName: true
	},
	logQueryParameters: process.env.NODE_ENV === 'development',
	logging: (query, time) => {
		// console.log(query);
		logger.info(time + 'ms' + ' ' + query);
	}
});

sequelize.authenticate();

const DB = {
	sequelize,
	card: CardModel(sequelize),
	config: ConfigModel(sequelize),
	log: LogModel(sequelize),
	user: UserModel(sequelize)
};

DB.log.belongsTo(DB.card, { foreignKey: 'cardCardId' });
DB.log.belongsTo(DB.user, { foreignKey: 'user_id' });
DB.user.hasOne(DB.card, { sourceKey: 'cardId', foreignKey: 'cardId', as: 'card' });
DB.card.belongsTo(DB.user, { foreignKey: 'cardId', as: 'user' });

export default DB;
