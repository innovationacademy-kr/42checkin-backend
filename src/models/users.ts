import * as Sequelize from 'sequelize';
import {DataTypes, Model, Optional} from 'sequelize';

export interface usersAttributes {
    _id: number;
    login: string;
    type?: string;
    card_no?: number;
    state?: string;
    checkin_at?: Date;
    checkout_at?: Date;
    checkout_by?: string;
    email?: string;
    deleted_at?: Date;
    updated_at?: Date;
    created_at?: Date;
}

export type usersPk = "_id";
export type usersId = Users[usersPk];
export type usersOptionalAttributes =
    "_id"
    | "type"
    | "card_no"
    | "state"
    | "checkin_at"
    | "checkout_at"
    | "checkout_by"
    | "email"
    | "deleted_at"
    | "updated_at"
    | "created_at";
export type usersCreationAttributes = Optional<usersAttributes, usersOptionalAttributes>;

export class Users extends Model<usersAttributes, usersCreationAttributes> implements usersAttributes {
    _id!: number;
    login!: string;
    type?: string;
    card_no?: number;
    state?: string;
    checkin_at?: Date;
    checkout_at?: Date;
    checkout_by?: string;
    email?: string;
    deleted_at?: Date;
    updated_at?: Date;
    created_at?: Date;


    static initModel(sequelize: Sequelize.Sequelize): typeof Users {
        Users.init({
            _id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true
            },
            login: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: "users_login_uindex"
            },
            type: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            card_no: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            state: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            checkin_at: {
                type: DataTypes.DATE,
                allowNull: true
            },
            checkout_at: {
                type: DataTypes.DATE,
                allowNull: true
            },
            checkout_by: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            email: {
                type: DataTypes.STRING(100),
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
            tableName: 'users',
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
                    name: "users_login_uindex",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        {name: "login"},
                    ]
                },
                {
                    name: "users__id_uindex",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        {name: "_id"},
                    ]
                },
            ]
        });
        return Users;
    }
}
