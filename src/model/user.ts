import DB from '@config/database';
import ApiError from '@lib/errorHandle';
import httpStatus from 'http-status';
import { Sequelize, DataTypes, Model, Association } from 'sequelize';
import { Card, CardModel } from './card';

export interface User {
	_id: number;
	userId: number;
	cardId: number;
	isAdmin: boolean;
	userName: string;
	email: string;
	card?: CardModel;
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

	async findWithCard(id: number) {
		const user = await UserModel.findOne({
			where: { _id: id },
			include: [{ model: DB.card, required: false, as: 'card' }],
		})
		if (!user) throw new ApiError(httpStatus.NOT_FOUND, '해당 카드를 사용중인 유저가 존재하지 않습니다.');
		return user;
	}

	async getCard(id: number) {
		const user = await this.findWithCard(id);
		const card = user?.card;
		if (!card) throw new ApiError(httpStatus.NOT_FOUND, '사용중인 카드가 존재하지 않습니다.');
		return card;
	}

	async setCard(id: number, card: CardModel) {
		const user = await this.findWithCard(id);
		if (user.cardId) throw new ApiError(httpStatus.BAD_REQUEST, '이미 사용중인 카드가 존재합니다.');
		user.cardId = card.cardId;
		await user.save();
		return user;
	}

	async clearCard(id: number) {
		const user = await this.findWithCard(id);
		const card = user.card;
		if (!card) throw new ApiError(httpStatus.BAD_REQUEST, '이미 사용중인 카드입니다.');
		user.cardId = null;
		await user.save();
		return user;
	}
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
