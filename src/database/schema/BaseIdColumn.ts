import {EntitySchemaColumnOptions} from "typeorm";

export const BaseIdColumn = {
    id: {
        type: Number,
        primary: true,
        generated: true,
    } as EntitySchemaColumnOptions,
};
