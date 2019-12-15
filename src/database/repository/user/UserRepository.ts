import {IUserRepository} from "../../../core/data/IUserRepository";
import User from "../../../core/model/user/User";
import BaseRepository from "../_base/BaseRepository";
import {UserEntity} from "../../schema/user/UserSchema";
import {inject, injectable} from "inversify";
import DatabaseProvider from "../../DatabaseProvider";
import {IPermissionRepository} from "../../../core/data/IPermissionRepository";
import {ITokenRepository} from "../../../core/data/ITokenRepository";

@injectable()
export default class UserRepository extends BaseRepository<User> implements IUserRepository {

    protected tableAlias = 'user';
    protected keys: string[] = ['user.id', 'user.firstName', 'user.lastName', 'user.email', 'user.hash'];
    protected exclusiveKey: string = 'email';
    protected exclusiveKeyCombination: string[] = ['email'];


    @inject("IPermissionRepository")
    private permissionRepository: IPermissionRepository;
    @inject("ITokenRepository")
    private tokenRepository: ITokenRepository;

    constructor(db: DatabaseProvider) {
        super();
        this.dbManager = db.getRepository(UserEntity);
    }

    async GetByEmail(email: string): Promise<User> {

        let dataRow = await this.dbManager.createQueryBuilder(this.tableAlias)
            .select(this.keys)
            //.leftJoinAndSelect("UserHasPermissions", "u_has_p", "u_has_p.userId = user.id")
            //.leftJoinAndSelect("permission", "perm", "u_has_p.permissionId = perm.id")
            .andWhere("email = :email ", {email: email})
            .getRawOne();

        return (dataRow != undefined) ? this.toDomainModel(dataRow) : await Promise.reject(dataRow);
    }

    async GetByToken(token: string): Promise<User> {

        let dataRow = await this.dbManager.createQueryBuilder(this.tableAlias)
            .select(this.keys)
            .leftJoinAndSelect("token", "token", "token.userId = " + this.tableAlias + ".id")
            .andWhere("token.token = :token ", {token: token})
            .getRawOne();


        return (dataRow != undefined) ? this.toDomainModel(dataRow) : await Promise.reject(dataRow);
    }

    async Save(entity: User): Promise<User> {
        await this.Exists(entity);
        if (!await this.Exists(entity))
            return await this.Add(entity);
        else if (await this.Exists(entity) && !entity.id) {
            let entityORM = await this.dbManager.createQueryBuilder(this.tableAlias)
                .where(this.tableAlias + ".email = :email", entity)
                .getOne();
            entity.id = (entityORM) ? entityORM.id : undefined;
        }

        return await this.dbManager.save(entity);
    }


    async toDomainModel(dataRow: any): Promise<User> {

        let newDomainModel = new User();

        if (dataRow.user_id) newDomainModel.id = dataRow.user_id;
        if (dataRow.user_email) newDomainModel.email = dataRow.user_email;
        if (dataRow.user_firstName) newDomainModel.firstName = dataRow.user_firstName;
        if (dataRow.user_lastName) newDomainModel.lastName = dataRow.user_lastName;
        if (dataRow.user_hash) newDomainModel.hash = dataRow.user_hash;

        newDomainModel = await this.dependentMapper(newDomainModel);

        return newDomainModel;
    }

    async dependentMapper(user: User): Promise<User> {
        user.permissions = await this.permissionRepository.GetByUser(user);
        user.tokens = await this.tokenRepository.GetByUser(user);

        return user;
    }

}
