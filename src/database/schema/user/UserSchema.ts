import {EntitySchema} from "typeorm";
import {BaseIdColumn} from "../BaseIdColumn";
import {BaseTimestampColumns} from "../BaseTimestampColumns";
import User from "../../../core/model/user/User";

export const UserEntity = new EntitySchema<User>({
    name: "User",
    tableName: "user",
    columns: {
        ...BaseIdColumn,
        email: {
            type: String,
            unique: true,
        },
        hash: {
            type: String,
        },
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        ...BaseTimestampColumns
    },
    relations: {
        permissions: {
            type: "many-to-many",
            target: "Permission",
            joinTable: {name: 'UserHasPermissions'},
            eager: true,
        },
        tokens: {
            type: "one-to-many",
            target: "Token",
            inverseSide: "user"
        },
        priceLists: {
            type: "one-to-many",
            target: "PriceList",
            inverseSide: "creator"
        },
    }
});
