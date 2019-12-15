import {EntitySchema} from "typeorm";
import {BaseIdColumn} from "../BaseIdColumn";
import {BaseTimestampColumns} from "../BaseTimestampColumns";
import Token from "../../../core/model/user/Token";

export const TokenEntity = new EntitySchema<Token>({
    name: "Token",
    tableName: "token",
    columns: {
        ...BaseIdColumn,
        token: {
            type: String,
        },
        ...BaseTimestampColumns
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            inverseSide: "tokens"
        },
    }
});
