import {EntitySchema} from "typeorm";
import {BaseIdColumn} from "../BaseIdColumn";
import {BaseTimestampColumns} from "../BaseTimestampColumns";
import Product from "../../../core/model/product/Product";

export const ProductEntity = new EntitySchema<Product>({
    name: "Product",
    tableName: "product",
    columns: {
        ...BaseIdColumn,
        name: {
            type: String,
        },
        model: {
            type: String,
        },
        buyer: {
            type: String,
        },
        sellPrice: {
            type: Number,
        },
        weight: {
            type: Number,
        },
        ...BaseTimestampColumns
    },
    relations: {
        assemblyLists: {
            type: "one-to-many",
            target: "AssemblyList",
            inverseSide: "product",
            eager: true,
        },
    }
});
