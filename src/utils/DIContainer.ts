import {Container} from "inversify";
import ProductRepository from "../database/repository/product/ProductRepository";
import AssemblyListRepository from "../database/repository/assembly_list/AssemblyListRepository";
import PartRepository from "../database/repository/part/PartRepository";
import MaterialRepository from "../database/repository/material/MaterialRepository";
import PriceListRepository from "../database/repository/price_list/PriceListRepository";
import PriceItemRepository from "../database/repository/price_list/PriceItemRepository";
import UserRepository from "../database/repository/user/UserRepository";
import PermissionRepository from "../database/repository/user/PermissionRepository";
import AuthService from "../core/service/AuthService";
import PriceListService from "../core/service/priceList/PriceListService";
import AssemblyListService from "../core/service/assemblyList/AssemblyListService";
import DatabaseProvider from "../database/DatabaseProvider";
import TokenRepository from "../database/repository/user/TokenRepository";
import {ITokenRepository} from "../core/data/ITokenRepository";
import {IPriceItemRepository} from "../core/data/IPriceItemRepository";
import ProductService from "../core/service/product/ProductService";
import {PopulateDatabase} from "../database/PopulateDatabase";


let DIContainer = new Container();


///// DATABASE CONNECTION
DIContainer.bind<DatabaseProvider>(DatabaseProvider).toSelf();

///// REPOSITORIES
DIContainer.bind<ProductRepository>("IProductRepository").to(ProductRepository);
DIContainer.bind<AssemblyListRepository>("IAssemblyListRepository").to(AssemblyListRepository);
DIContainer.bind<PartRepository>("IPartRepository").to(PartRepository);
DIContainer.bind<MaterialRepository>("IMaterialRepository").to(MaterialRepository);
DIContainer.bind<PriceListRepository>("IPriceListRepository").to(PriceListRepository);
DIContainer.bind<PriceItemRepository>("IPriceItemRepository").to(PriceItemRepository);
DIContainer.bind<UserRepository>("IUserRepository").to(UserRepository);
DIContainer.bind<PermissionRepository>("IPermissionRepository").to(PermissionRepository);
DIContainer.bind<TokenRepository>("ITokenRepository").to(TokenRepository);

///// SERVICES
DIContainer.bind<AuthService>(AuthService).toSelf().inSingletonScope();
DIContainer.bind<PriceListService>(PriceListService).toSelf();
DIContainer.bind<AssemblyListService>(AssemblyListService).toSelf();
DIContainer.bind<ProductService>(ProductService).toSelf();
DIContainer.bind<PopulateDatabase>(PopulateDatabase).toSelf();


export default DIContainer;
