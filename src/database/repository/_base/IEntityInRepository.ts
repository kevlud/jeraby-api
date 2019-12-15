import {DeepPartial} from "typeorm";

export default interface IEntityInRepository<T extends DeepPartial<T>> {
    id: number;
}
