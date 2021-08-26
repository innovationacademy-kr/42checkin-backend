import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface Card {
	cardId: number;
	using: boolean;
	type: number;
}

type CardCreateInterface = Pick<Card, 'type'>;

export class CardModel extends Model<Card, CardCreateInterface> implements Card {
  public cardId: number;
  public using: boolean;
  public type: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

export default function (sequelize: Sequelize): typeof CardModel {
  CardModel.init(
    {
      cardId: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      using: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
		defaultValue: false
      },
      type: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'card',
	  modelName: 'card',
      sequelize,
    },
  );

  return CardModel;
}
