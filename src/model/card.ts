import { Sequelize, DataTypes, Model } from 'sequelize';

export interface Card {
	cardId: number;
	using: boolean;
	type: number;
	deletedAt: Date;
}

type CardCreateInterface = Pick<Card, 'type'>;

export class CardModel extends Model<Card, CardCreateInterface> implements Card {
	public cardId: number;
	public using: boolean;
	public type: number;
	public deletedAt: Date;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

export default function(sequelize: Sequelize): typeof CardModel {
	CardModel.init(
		{
			cardId: {
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			using: {
				allowNull: false,
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			type: {
				allowNull: false,
				type: DataTypes.INTEGER
			},
			deletedAt: {
				type: DataTypes.INTEGER,
				allowNull: true
			}
		},
		{
			tableName: 'card',
			modelName: 'card',
			sequelize,
		}
	);

	return CardModel;
}
