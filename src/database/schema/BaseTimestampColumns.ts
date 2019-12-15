import {EntitySchemaColumnOptions} from "typeorm";

export const BaseTimestampColumns = {
    createdAt: {
        name: 'createdAt',
        type: 'timestamp',
        createDate: true,
    } as EntitySchemaColumnOptions,
    updatedAt: {
        name: 'updatedAt',
        type: 'timestamp',
        updateDate: true,
    } as EntitySchemaColumnOptions,
};
