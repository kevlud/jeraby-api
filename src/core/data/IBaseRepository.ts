export interface IBaseRepository<T> {
    Exists(entity: T): Promise<boolean>;

    GetAll(): Promise<T[]>;

    GetById(id: number): Promise<T>;

    Find(arg: any): Promise<T[]>;

    Add(entity: T): Promise<T>;

    Delete(entity: T): Promise<any>;

    Save(entity: T): Promise<T>;

    NextPrimaryKey(): Promise<number>

    toDomainModel(dataRow: any): Promise<T>;
}
