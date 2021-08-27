import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface Log {
	logId: number;
	logType: string;
}

type LogCreateInterface = Pick<Log, 'logType'>;

export class LogModel extends Model<Log, LogCreateInterface> implements Log {
	public logId: number;
	public logType: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
	public readonly deletedAt!: Date;
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
