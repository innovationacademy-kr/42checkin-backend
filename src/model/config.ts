import { Sequelize, DataTypes, Model } from 'sequelize';

export interface Config {
	maxCapSeocho: number;
	maxCapGaepo: number;
	env: string;
}

export class ConfigModel extends Model<Config> implements Config {
	public maxCapSeocho: number;
	public maxCapGaepo: number;
	public env: string;
}

export default function(sequelize: Sequelize): typeof ConfigModel {
	ConfigModel.init(
		{
			env: {
				primaryKey: true,
				type: DataTypes.CHAR(45)
			},
			maxCapSeocho: {
				allowNull: false,
				type: DataTypes.INTEGER
			},
			maxCapGaepo: {
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
