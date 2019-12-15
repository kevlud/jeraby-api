import {IBaseRepository} from "./IBaseRepository";
import Permission from "../model/user/Permission";
import User from "../model/user/User";

export interface IPermissionRepository extends IBaseRepository<Permission> {

    GetByUser(user: User): Promise<Permission[]>

    GetByName(name: string): Promise<Permission>

}
