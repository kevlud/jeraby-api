import {EntitySchema, getConnection, Repository} from "typeorm";
import {ObjectType} from "typeorm/browser";
import {injectable} from "inversify";

@injectable()
export default class DatabaseProvider {

    getRepository<Entity>(target: ObjectType<Entity> | EntitySchema<Entity> | string): Repository<Entity> {
        return getConnection().getRepository<Entity>(target);
    }

}
