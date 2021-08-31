import { Sequelize, DataTypes, Model } from 'sequelize';

interface Config {
	maxCapacity: number;
	env: string;
}

export class ConfigModel extends Model<Config> implements Config {
	public maxCapacity: number;
	public env: string;
}

export default function(sequelize: Sequelize): typeof ConfigModel {
	ConfigModel.init(
		{
			env: {
				primaryKey: true,
				type: DataTypes.CHAR(45)
			},
			maxCapacity: {
				allowNull: false,
				type: DataTypes.INTEGER
			}
		},
		{
			tableName: 'config',
			modelName: 'config',
			sequelize,
			timestamps: false
		}
	);

	return ConfigModel;
}
