import {IResolvers} from "graphql-tools";
import {AuthenticationError} from "apollo-server-express";
import AuthService from "../../core/service/AuthService";
import {GraphQLUpload} from "graphql-upload";
import {IMaterialRepository} from "../../core/data/IMaterialRepository";
import {ITokenRepository} from "../../core/data/ITokenRepository";
import PriceListService from "../../core/service/priceList/PriceListService";
import {inject, injectable} from "inversify";
import {IUserRepository} from "../../core/data/IUserRepository";
import {IPermissionRepository} from "../../core/data/IPermissionRepository";
import ProductService from "../../core/service/product/ProductService";
import {PermissionName} from "../../core/model/user/Permission";
import AssemblyListService from "../../core/service/assemblyList/AssemblyListService";
import {IPriceItemRepository} from "../../core/data/IPriceItemRepository";

@injectable()
export default class GraphQLResolver {

    @inject("IPermissionRepository")
    private permissionRepo: IPermissionRepository;
    @inject("ITokenRepository")
    private tokenRepository: ITokenRepository;
    @inject("IUserRepository")
    private userRepo: IUserRepository;
    @inject("IMaterialRepository")
    private materialRepository: IMaterialRepository;
    @inject("IPriceItemRepository")
    private priceItemRepository: IPriceItemRepository;

    @inject(AuthService)
    private authService: AuthService;
    @inject(AssemblyListService)
    private assemblyListService: AssemblyListService;
    @inject(PriceListService)
    private priceListService: PriceListService;
    @inject(ProductService)
    private productService: ProductService;


    public get resolvers(): IResolvers {

        return {
            Upload: GraphQLUpload,
            Query: {
                me: async (_, __, {req}) => {
                    await this.authService.checkSession(req.session);

                    let user = await this.userRepo.GetByToken(req.session.token);

                    return user;
                },

                getProduct: async (_, {id}, ___) => {
                    return await this.productService.getProductById(id);
                },
                getProducts: async (_, __, ___) => {
                    return this.productService.getAllProducts()
                },


                getPriceList: async (_, {id}, {req}) => {


                    let priceList = (id == undefined) ? await this.priceListService.getCurrentPriceList() : await this.priceListService.getPriceListById(id);

                    priceList.priceItems = await this.priceItemRepository.GetByPriceList(priceList);
                    for (let priceItem of priceList.priceItems)
                        priceItem.material = await this.materialRepository.GetByPriceItem(priceItem);

                    return priceList;
                },
                getPriceLists: async (_, __, {req}) => {
                    return this.priceListService.getAllPriceLists();
                },


                getAllMaterialsWithoutPriceItem: async (_, __, {req}) => {
                    return await this.materialRepository.GetAllWithoutPriceItem();
                },
                getAllMaterials: async (_, __, {req}) => {
                    return await this.materialRepository.GetAll();
                },
            },
            Mutation: {


                // USE CASE 1 : LOGIN
                login: async (_, {email, password}, {req}) => {

                    return await this.authService.loginUser(email, password, req.session);
                },
                logout: async (_, __, {req, res}) => {
                    await new Promise(res => req.session.destroy(() => res()));
                    res.clearCookie("connect.sid");

                    return true;
                },
                register: async (_, {email, password, firstName, lastName}) => {
                    return await this.authService.registerUser(email, password, firstName, lastName);
                },


                // USE CASE 2 : UPLOAD PRICE LIST
                parsePriceListXLSX: async (source, {filename}, {req}) => {
                    await this.authService.checkSession(req.session);

                    if (!this.authService.currentUser.hasPermission(PermissionName.PRICELIST))
                        throw new AuthenticationError('Access denied.');

                    await this.priceListService.importPriceListFromXls(filename);

                    return true;
                },


                // USE CASE 2B : UPLOAD ASSEMBLY LIST
                parseAssemblyListXLSX: async (source, {filename}, {req}) => {
                    await this.authService.checkSession(req.session);

                    if (!this.authService.currentUser.hasPermission(PermissionName.PRICELIST))
                        throw new AuthenticationError('Access denied.');

                    await this.assemblyListService.importAssemblyListFromXls(filename);

                    return true;
                },

                // USE CASE 3 : EXPORT ALL PRODUCTS PRICING

                exportProductPrices: async (_, __, {req}) => {
                    await this.productService.exportProductPrices();
                    return "http://localhost:4001/downloadProductPrices";
                }

            }
        };
    }
}

