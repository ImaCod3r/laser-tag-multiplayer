import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/sequelize";

export class User extends Model {
    declare id: string;
    declare username: string;
    declare avatar: string | null;
}

User.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: "users"
})