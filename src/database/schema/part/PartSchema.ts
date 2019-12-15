import {EntitySchema} from "typeorm";
import {BaseIdColumn} from "../BaseIdColumn";
import {BaseTimestampColumns} from "../BaseTimestampColumns";
import Part from "../../../core/model/part/Part";


export const PartEntity = new EntitySchema<Part>({
    name: "Part",
    tableName: "part",
    columns: {
        ...BaseIdColumn,
        weight: {
            type: "double",
            nullable: false,
            default: 0,
        },
        height: {
            type: "double",
            nullable: false,
            default: 0,
        },
        width: {
            type: "double",
            nullable: false,
            default: 0,
        },
        length: {
            type: "double",
            nullable: false,
            default: 0,
        },
        thickness: {
            type: "double",
            nullable: false,
            default: 0,
        },
        materialId: {
            type: "integer",
            default: 0
        },
        ...BaseTimestampColumns
    },
    relations: {
        assemblyList: {
            type: "many-to-one",
            target: "AssemblyList",
        },
        material: {
            type: "many-to-one",
            target: "Material",
            eager: true,
        },
    }
});
