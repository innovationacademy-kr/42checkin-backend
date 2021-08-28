import { Sequelize, DataTypes, Model, Association } from 'sequelize';
import { CardModel } from './card';
import { UserModel } from './user';

interface Log {
	logId: number;
	logType: string;
	user_id: number;
	cardCardId: number;
}

type LogCreateInterface = Pick<Log, 'logType' | 'user_id' | 'cardCardId'>;

export class LogModel extends Model<Log, LogCreateInterface> implements Log {
	public logId: number;
	public logType: string;
	public user_id: number;
	public cardCardId: number;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
	public readonly deletedAt!: Date;

	public static associations: {
    	card: Association<LogModel, CardModel>;
    	user: Association<LogModel, UserModel>;
  	};
}

export default function(sequelize: Sequelize): typeof LogModel {
	LogModel.init(
		{
			logId: {
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			logType: {
				allowNull: false,
				type: DataTypes.INTEGER
			},
			user_id: {
				allowNull: false,
				type: DataTypes.INTEGER
			},
			cardCardId: {
				allowNull: false,
				type: DataTypes.INTEGER
			}
		},
		{
			tableName: 'log',
			modelName: 'log',
			sequelize
		}
	);

	return LogModel;
}
