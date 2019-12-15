import {EntitySchema} from "typeorm";
import {BaseIdColumn} from "../BaseIdColumn";
import {BaseTimestampColumns} from "../BaseTimestampColumns";
import Material from "../../../core/model/material/Material";

export const MaterialEntity = new EntitySchema<Material>({
    name: "Material",
    tableName: "material",
    columns: {
        ...BaseIdColumn,
        type: {
            type: String,
        },
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
        ...BaseTimestampColumns
    },
    relations: {
        parts: {
            type: "one-to-many",
            target: "Part",
            joinColumn: true,
        },
        priceItems: {
            type: "one-to-many",
            target: "PriceItem",
            inverseSide: "material",
            eager: true,
        }
    }
});
