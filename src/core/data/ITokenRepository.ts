import {IBaseRepository} from "./IBaseRepository";
import Token from "../model/user/Token";
import User from "../model/user/User";

export interface ITokenRepository extends IBaseRepository<Token> {

    GetByToken(token: string): Promise<Token>

    GetByUser(user: User): Promise<Token[]>

}
