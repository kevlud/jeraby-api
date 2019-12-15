import {IBaseRepository} from "./IBaseRepository";
import User from "../model/user/User";

export interface IUserRepository extends IBaseRepository<User> {

    GetByEmail(email: string): Promise<User>

    GetByToken(token: string): Promise<User>

}
