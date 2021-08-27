import { Sequelize, DataTypes, Model, Association } from 'sequelize';
import { CardModel } from './card';

export interface User {
	_id: number;
	userId: number;
	cardId: number;
	isAdmin: boolean;
	userName: string;
	email: string;
}

type UserCreateInterface = Pick<User, 'userName' | 'email' | 'userId'>;

export class UserModel extends Model<User, UserCreateInterface> implements User {
	public _id: number;
	public userId: number;
	public cardId: number;
	public isAdmin: boolean;
	public userName: string;
	public email: string;
	public card?: CardModel;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
	public readonly deletedAt!: Date;

	public static associations: {
    	card: Association<UserModel, CardModel>;
  	};
}

export default function(sequelize: Sequelize): typeof UserModel {
	UserModel.init(
		{
			_id: {
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			userId: {
				allowNull: false,
				type: DataTypes.INTEGER
			},
			cardId: {
				allowNull: true,
				type: DataTypes.INTEGER
			},
			userName: {
				allowNull: false,
				type: DataTypes.CHAR
			},
			email: {
				allowNull: false,
				type: DataTypes.CHAR
			},
			isAdmin: {
				allowNull: false,
				type: DataTypes.BOOLEAN
			}
		},
		{
			tableName: 'user',
			modelName: 'user',
			sequelize
		}
	);

	return UserModel;
}
