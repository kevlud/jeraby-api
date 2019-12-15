import {EntitySchema} from "typeorm";
import {BaseIdColumn} from "../BaseIdColumn";
import {BaseTimestampColumns} from "../BaseTimestampColumns";
import AssemblyList from "../../../core/model/assembly_list/AssemblyList";

export const AssemblyListEntity = new EntitySchema<AssemblyList>({
    name: "AssemblyList",
    tableName: "assemblyList",
    columns: {
        ...BaseIdColumn,
        name: {
            type: String,
            nullable: true,
        },
        ...BaseTimestampColumns
    },
    relations: {
        parts: {
            type: "one-to-many",
            target: "Part",
            inverseSide: "assemblyList",
            eager: true
        },
        product: {
            type: "many-to-one",
            target: "Product",
        },
    }
});
