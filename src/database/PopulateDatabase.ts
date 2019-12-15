import {IPriceItemRepository} from "../core/data/IPriceItemRepository";
import {ITokenRepository} from "../core/data/ITokenRepository";
import {IPriceListRepository} from "../core/data/IPriceListRepository";
import {IProductRepository} from "../core/data/IProductRepository";
import {IMaterialRepository} from "../core/data/IMaterialRepository";
import {IUserRepository} from "../core/data/IUserRepository";
import {IPermissionRepository} from "../core/data/IPermissionRepository";
import {IAssemblyListRepository} from "../core/data/IAssemblyListRepository";
import {IPartRepository} from "../core/data/IPartRepository";
import {inject, injectable} from "inversify";
import Permission, {PermissionName} from "../core/model/user/Permission";
import User from "../core/model/user/User";
import Product from "../core/model/product/Product";
import Material from "../core/model/material/Material";


@injectable()
export class PopulateDatabase {

    @inject("IProductRepository")
    private productRepository: IProductRepository;
    @inject("IAssemblyListRepository")
    private assemblyListRepository: IAssemblyListRepository;
    @inject("IPartRepository")
    private partRepository: IPartRepository;

    @inject("IPriceListRepository")
    private priceListRepository: IPriceListRepository;
    @inject("IPriceItemRepository")
    private priceItemRepository: IPriceItemRepository;
    @inject("IMaterialRepository")
    private materialRepository: IMaterialRepository;


    @inject("IUserRepository")
    private userRepository: IUserRepository;
    @inject("IPermissionRepository")
    private permissionRepository: IPermissionRepository;
    @inject("ITokenRepository")
    private tokenRepository: ITokenRepository;


    async populate() {


        let admin: User = new User();
        admin.firstName = "Matěj";
        admin.lastName = "Nevlud";
        admin.email = "nevlud3@gmail.com";
        admin.hash = "$2a$10$6qLmgEh6ISVtoHiHg5FiwOBMgmFG8xZQzQj4FInDpGFnxLOiwfDg.";

        await this.userRepository.Save(admin);

        let permAdmin = new Permission();
        permAdmin.name = PermissionName.ADMIN;

        let permMaterial = new Permission();
        permMaterial.name = PermissionName.MATERIAL;

        let perm2 = new Permission();
        perm2.name = PermissionName.PRICELIST;

        await this.permissionRepository.Save(permAdmin);
        await this.permissionRepository.Save(permMaterial);
        perm2 = await this.permissionRepository.Save(perm2);



        let product = new Product();
        product.name = "Akari";
        product.model = "B-54";
        product.buyer = "CAT";
        product.sellPrice = 10003;
        product.weight = 6.75;
        await this.productRepository.Save(product);


        let material = new Material();
        material.id = 1;
        material.type = "plech";
        material.weight = 12;
        material.height = 0;
        material.width = 1000;
        material.length = 1000;
        material.thickness = 5;
        await this.materialRepository.Save(material);

        let material2 = new Material();
        material2.id = 2;
        material2.type = "trubka";
        material2.weight = 500;
        material2.height = 0;
        material2.width = 500;
        material2.length = 1000;
        material2.thickness = 40;
        await this.materialRepository.Save(material2);
    }

}
