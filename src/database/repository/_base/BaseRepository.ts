import {IBaseRepository} from "../../../core/data/IBaseRepository";
import {Repository} from "typeorm";
import {injectable} from "inversify";

@injectable()
export default abstract class BaseRepository<T extends any> implements IBaseRepository<T> {

    protected dbManager: Repository<T>;

    protected tableAlias = 'table_name';
    protected keys: string[] = ['table_name.id', 'table_name.otherKey'];
    protected exclusiveKey: string = 'otherKey';
    protected exclusiveKeyCombination: string[] = ['otherKey'];

    async Delete(entity: T): Promise<any> {
        return undefined;
    }

    async Exists(entity: T): Promise<boolean> {
        let dataRow;

        let exclusiveWhere: string = "";
        for (let exKey of this.exclusiveKeyCombination)
            if (entity[exKey] != undefined)
                exclusiveWhere += `${this.tableAlias}.${exKey} = :${exKey} AND `;
        exclusiveWhere += "TRUE";

        console.log(exclusiveWhere);

        if (entity.id != undefined)
            dataRow = await this.dbManager.createQueryBuilder(this.tableAlias)
                .select(this.keys)
                .where(this.tableAlias + ".id = :id", entity)
                .getRawOne();
        else
            dataRow = await this.dbManager.createQueryBuilder(this.tableAlias)
                .select(this.keys)
                //.where(`${this.tableAlias}.${this.exclusiveKey} = :${this.exclusiveKey}`, entity)
                .where(exclusiveWhere, entity)
                .getRawOne();

        return dataRow != undefined;
    }

    async GetAll(): Promise<T[]> {
        let dataRows = await this.dbManager.createQueryBuilder(this.tableAlias)
            .select(this.keys)
            .getRawMany();

        let models: T[] = [];
        for (const value of dataRows) {
            models.push(await this.toDomainModel(value));
        }

        return models;
    }

    async GetById(id: number): Promise<T> {
        let dataRow = await this.dbManager.createQueryBuilder(this.tableAlias)
            .select(this.keys)
            .where(this.tableAlias + ".id = :id", {id: id})
            .getRawOne();

        return this.toDomainModel(dataRow)
    }

    async Find(args: any): Promise<T[]> {

        let whereString = "";
        for (let key of Object.keys(args))
            whereString += ` AND ${this.tableAlias}.${key} = :${key}`;


        whereString = whereString.replace(' AND ', '');

        let dataRows = await this.dbManager.createQueryBuilder(this.tableAlias)
            .select(this.keys)
            .where(whereString, args)
            .getRawMany();

        let models: T[] = [];
        for (const value of dataRows) {
            models.push(await this.toDomainModel(value));
        }

        return models;

    }

    async Save(entity: T): Promise<T> {
        await this.Exists(entity);
        if (!await this.Exists(entity))
            return await this.Add(entity);
        else if (await this.Exists(entity) && !entity.id) {
            let exclusiveWhere: string = "";
            for (let exKey of this.exclusiveKeyCombination)
                if (entity[exKey] != undefined)
                    exclusiveWhere += `${this.tableAlias}.${exKey} = :${exKey} AND `;
            exclusiveWhere += "TRUE";

            let entityORM = await this.dbManager.createQueryBuilder(this.tableAlias)
                .where(exclusiveWhere, entity)
                .getOne();
            entity.id = (entityORM) ? entityORM.id : undefined;
        }

        return entity;

        await this.dbManager.createQueryBuilder(this.tableAlias)
            .update(this.tableAlias)
            .set(entity)
            .where(this.tableAlias + ".id = :id", entity)
            .execute();

        return entity;
    }

    async Add(entity: T): Promise<T> {

        await this.dbManager.createQueryBuilder(this.tableAlias)
            .insert()
            .into(this.tableAlias)
            .values(entity)
            .execute();

        let lastInsert = await this.dbManager.createQueryBuilder(this.tableAlias)
            .select(this.keys)
            .where(`${this.tableAlias}.${this.exclusiveKey} = :${this.exclusiveKey}`, entity)
            .getRawOne();

        return this.toDomainModel(lastInsert);
    }

    async NextPrimaryKey(): Promise<number> {
        let dataRow = await this.dbManager.createQueryBuilder(this.tableAlias)
            .select("MAX(id) + 1 as next_id")
            .getRawOne();

        return dataRow.next_id;
    }

    abstract async toDomainModel(dataRow: any): Promise<T>;


}
