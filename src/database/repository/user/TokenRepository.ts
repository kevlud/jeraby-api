import Token from "../../../core/model/user/Token";
import BaseRepository from "../_base/BaseRepository";
import {TokenEntity} from "../../schema/user/TokenSchema";
import User from "../../../core/model/user/User";
import {injectable} from "inversify";
import DatabaseProvider from "../../DatabaseProvider";

@injectable()
export default class TokenRepository extends BaseRepository<Token> {

    protected tableAlias = 'token';
    protected keys: string[] = ['id', 'token', 'userId'];
    protected exclusiveKey: string = 'token';
    protected exclusiveKeyCombination: string[] = ['token'];

    constructor(db: DatabaseProvider) {
        super();
        this.dbManager = db.getRepository(TokenEntity);
    }

    async GetByToken(token: string): Promise<Token> {

        let dataRow = await this.dbManager.createQueryBuilder(this.tableAlias)
            .select(this.keys)
            .where(this.tableAlias + ".token = :token", {token: token})
            .getRawOne();

        return this.toDomainModel(dataRow)
    }

    async GetByUser(user: User): Promise<Token[]> {

        let dataRows = await this.dbManager.createQueryBuilder(this.tableAlias)
            .select(this.keys)
            .where(this.tableAlias + ".userId = :userId", {userId: user.id})
            .getRawMany();

        let models: Token[] = [];
        for (const value of dataRows) {
            models.push(await this.toDomainModel(value));
        }

        return models;
    }

    async toDomainModel(dataRow: any): Promise<Token> {
        let newDomainModel = new Token();

        if (dataRow.token_id) newDomainModel.id = dataRow.token_id;
        if (dataRow.token_token) newDomainModel.token = dataRow.token_token;

        return newDomainModel;
    }
}
