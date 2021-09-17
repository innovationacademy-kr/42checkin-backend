import * as Sequelize from 'sequelize';
import {Association, DataTypes, Model, Optional} from 'sequelize';
import { Users } from './users';

export interface historyAttributes {
    _id: number;
    login?: string;
    type?: string;
    card_no?: number;
    deleted_at?: Date;
    updated_at?: Date;
    created_at?: Date;
}

export type historyPk = "_id";
export type historyId = History[historyPk];
export type historyOptionalAttributes =
    "_id"
    | "login"
    | "type"
    | "card_no"
    | "deleted_at"
    | "updated_at"
    | "created_at";
export type historyCreationAttributes = Optional<historyAttributes, historyOptionalAttributes>;

export class History extends Model<historyAttributes, historyCreationAttributes> implements historyAttributes {
    _id!: number;
    login?: string;
    type?: string;
    card_no?: number;
    deleted_at?: Date;
    updated_at?: Date;
    created_at?: Date;


    static initModel(sequelize: Sequelize.Sequelize): typeof History {
        History.init({
            _id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true
            },
            login: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            type: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            card_no: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: true
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'history',
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        {name: "_id"},
                    ]
                },
                {
                    name: "history__id_uindex",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        {name: "_id"},
                    ]
                },
            ]
        });
        return History;
    }

    public static associations: {
        projects: Association<History, Users>;
    };
}
