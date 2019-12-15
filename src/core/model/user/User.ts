import Permission from "./Permission";
import PriceList from "../price_list/PriceList";
import Token from "./Token";

export default class User {
    id?: number;

    email: string;
    hash: string;
    firstName: string;
    lastName: string;

    priceLists: PriceList[];

    permissions: Permission[];


    tokens: Token[];

    createdAt: Date;

    updatedAt: Date;

    get isAdmin() {
        return this.permissions.find((r) => {
            return r.name == "ADMIN"
        })
    }

    public addPermission(perm: Permission): boolean {
        if (!this.permissions) this.permissions = [];
        this.permissions.push(perm);

        return true;
    }

    public removePermission(perm: Permission): boolean {

        this.permissions = this.permissions.filter(value => value.name != perm.name);

        return true;
    }

    public addToken(token: Token): boolean {
        if (!this.tokens) this.tokens = [];
        this.tokens.push(token);

        return true;
    }

    public removeToken(token: Token): boolean {

        this.tokens = this.tokens.filter(value => value.token != token.token);

        return true;
    }

    get currentToken() {
        if (this.tokens.length > 0)
            return this.tokens[this.tokens.length - 1].token;
        else
            return null
    }

    hasPermission(material: string) {
        for (let perm of this.permissions)
            if (perm.name == material)
                return true;

        return false;
    }
}
