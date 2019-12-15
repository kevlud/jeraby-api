import {EntitySchema} from "typeorm";
import {BaseIdColumn} from "../BaseIdColumn";
import {BaseTimestampColumns} from "../BaseTimestampColumns";
import PriceList from "../../../core/model/price_list/PriceList";


export const PriceListEntity = new EntitySchema<PriceList>({
    name: "PriceList",
    tableName: "priceList",
    columns: {
        ...BaseIdColumn,
        importDate: {
            type: "date",
        },
        description: {
            type: "text",
        },
        ...BaseTimestampColumns
    },

    relations: {
        creator: {
            type: "many-to-one",
            target: "User",
            eager: true,
            inverseSide: "priceLists"
        },
        priceItems: {
            type: "one-to-many",
            target: "PriceItem",
            eager: true,
            inverseSide: "priceList"
        }
    }
});
