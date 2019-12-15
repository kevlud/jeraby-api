import {EntitySchema} from "typeorm";
import {BaseIdColumn} from "../BaseIdColumn";
import {BaseTimestampColumns} from "../BaseTimestampColumns";
import Permission from "../../../core/model/user/Permission";

export const PermissionEntity = new EntitySchema<Permission>({
    name: "Permission",
    tableName: "permission",
    columns: {
        ...BaseIdColumn,
        name: {
            type: String,
        },
        ...BaseTimestampColumns
    },
});
