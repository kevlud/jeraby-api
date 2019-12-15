import {AuthenticationError} from "apollo-server-express";
import * as bcrypt from "bcryptjs";
import User from "../model/user/User";
import Token from "../model/user/Token";
import {IUserRepository} from "../data/IUserRepository";
import {IPermissionRepository} from "../data/IPermissionRepository";
import {ITokenRepository} from "../data/ITokenRepository";
import {inject, injectable} from "inversify";

@injectable()
export default class AuthService {


    @inject("IUserRepository")
    private userRepository: IUserRepository;
    @inject("IPermissionRepository")
    private permissionRepository: IPermissionRepository;
    @inject("ITokenRepository")
    private tokenRepository: ITokenRepository;

    private loggedUser: User;

    get currentUser(): User {
        return this.loggedUser;
    }

    async checkSession(session: any): Promise<boolean> {

        try {
            console.log(session)
            let token = await this.tokenRepository.GetByToken(session.token);


            let user = await this.userRepository.GetByToken(token.token);
            //user.permissions = await this.permissionRepository.GetByUser(user);


        } catch (e) {
            throw new AuthenticationError('Access denied.');
        }

        return true;
    }

    async loginUser(email: string, password: string, session: any): Promise<User> {

        try {
            let user = await this.userRepository.GetByEmail(email);
            const valid = await bcrypt.compare(password, user.hash);

            let token = new Token();
            token.token = await bcrypt.hash(Date.now().toString(), 10);
            token.user = user;

            token = await this.tokenRepository.Save(token);
            user.addToken(token);


            user.permissions = await this.permissionRepository.GetByUser(user);

            // Save user id in cookie on clients browser.
            session.idUser = user.id;
            session.token = token.token;
            this.loggedUser = user;

            return user;

        } catch (e) {
            throw new AuthenticationError('Access denied.');
        }
    }

    async registerUser(email: string, password: string, firstName: string, lastName: string) {

        const hashedPassword = await bcrypt.hash(password, 10);

        //this.userRepo.createUser(email, hashedPassword, firstName, lastName);
        let newUser: User = new User();
        newUser.email = email;
        newUser.hash = hashedPassword;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.permissions = [await this.permissionRepository.GetByName("ADMIN")];

        await this.userRepository.Save(newUser);

        return true;
    }
}
