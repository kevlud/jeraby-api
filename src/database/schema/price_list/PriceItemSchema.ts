import {EntitySchema} from "typeorm";
import {BaseIdColumn} from "../BaseIdColumn";
import {BaseTimestampColumns} from "../BaseTimestampColumns";
import PriceItem from "../../../core/model/price_list/PriceItem";


export const PriceItemEntity = new EntitySchema<PriceItem>({
    name: "PriceItem",
    tableName: "priceItem",
    columns: {
        ...BaseIdColumn,
        pricePerMeter: {
            type: "float",
        },
        pricePerKilo: {
            type: "float",
        },

        materialId: {
            type: "integer",
            default: 0
        },
        ...BaseTimestampColumns
    },
    relations: {
        priceList: {
            type: "many-to-one",
            target: "PriceList",
            inverseSide: "priceItems",
            joinColumn: true
        },
        material: {
            type: "many-to-one",
            target: "Material",
            inverseSide: "priceItems",
            joinColumn: true
        }
    }
});
