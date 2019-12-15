import {IPermissionRepository} from "../../../core/data/IPermissionRepository";
import Permission from "../../../core/model/user/Permission";
import {MOVISERROR} from "../../../MOVIS_Errors";
import BaseRepository from "../_base/BaseRepository";
import User from "../../../core/model/user/User";
import {PermissionEntity} from "../../schema/user/PermissionSchema";
import {injectable} from "inversify";
import DatabaseProvider from "../../DatabaseProvider";

@injectable()
export default class PermissionRepository extends BaseRepository<Permission> implements IPermissionRepository {

    protected tableAlias = 'permission';
    protected keys: string[] = ['permission.id', 'permission.name'];
    protected exclusiveKey: string = 'name';
    protected exclusiveKeyCombination: string[] = ['name'];

    constructor(db: DatabaseProvider) {
        super();
        this.dbManager = db.getRepository(PermissionEntity);
    }

    async GetByUser(user: User): Promise<Permission[]> {

        let dataRows = await this.dbManager.createQueryBuilder(this.tableAlias)
            .select(this.keys)
            .leftJoinAndSelect("UserHasPermissions", "u_has_p", "u_has_p.permissionId = " + this.tableAlias + ".id")
            .leftJoinAndSelect("user", "user", "u_has_p.userId = " + user.id)
            //.where(this.tableAlias + ".name = :name", {entity: entity})
            .getRawMany();

        let models: Permission[] = [];
        for (const value of dataRows) {
            models.push(await this.toDomainModel(value));
        }

        return models;
    }

    async GetByName(name: string): Promise<Permission> {

        let permissionORM = await this.dbManager.findOne({name: name});

        if (permissionORM == undefined)
            throw new MOVISERROR('Permission with name \'' + name + '\' not found.');
        else
            return permissionORM
    }

    async toDomainModel(dataRow: any): Promise<Permission> {
        let newDomainModel = new Permission();

        if (dataRow.permission_id) newDomainModel.id = dataRow.permission_id;
        if (dataRow.permission_name) newDomainModel.name = dataRow.permission_name;

        return newDomainModel;
    }
}
