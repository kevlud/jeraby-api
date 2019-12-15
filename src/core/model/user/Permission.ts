export default class Permission {
    id?: number;
    name: string;
}

export enum PermissionName {
    MATERIAL = "MATERIAL",
    PRICELIST = "PRICELIST",
    ASSEMBLYLIST = "ASSEMBLYLIST",
    PRODUCT = "PRODUCT",
    ADMIN = "ADMIN"
}
