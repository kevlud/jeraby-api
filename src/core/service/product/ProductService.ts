import {inject, injectable} from "inversify";
import * as XLSX from 'xlsx';
import Product from "../../model/product/Product";
import {IProductRepository} from "../../data/IProductRepository";
import {IAssemblyListRepository} from "../../data/IAssemblyListRepository";
import {IPartRepository} from "../../data/IPartRepository";
import {IMaterialRepository} from "../../data/IMaterialRepository";
import {IPriceItemRepository} from "../../data/IPriceItemRepository";

const {read, write, utils} = XLSX;


@injectable()
export default class ProductService {


    @inject("IProductRepository")
    private productRepository: IProductRepository;

    @inject("IAssemblyListRepository")
    private assemblyListRepository: IAssemblyListRepository;

    @inject("IPartRepository")
    private partRepository: IPartRepository;

    @inject("IMaterialRepository")
    private materialRepository: IMaterialRepository;

    @inject("IPriceItemRepository")
    private priceItemRepository: IPriceItemRepository;


    async getProductById(idProduct: number): Promise<Product> {
        let product = await this.productRepository.GetById(idProduct).catch(reason => Promise.reject(reason));
        product.assemblyLists = await this.assemblyListRepository.GetByProduct(product);
        for (let assemblyList of product.assemblyLists) {
            assemblyList.parts = await this.partRepository.GetByAssemblyList(assemblyList);
            for (let part of assemblyList.parts) {
                part.material = await this.materialRepository.GetByPart(part);
                part.material.priceItems = await this.priceItemRepository.GetByMaterial(part.material);
            }
        }
        return product;
    }


    async getAllProducts(): Promise<Product[]> {
        let products = await this.productRepository.GetAll();

        for (let product of products) {
            product.assemblyLists = await this.assemblyListRepository.GetByProduct(product);
            for (let assemblyList of product.assemblyLists) {
                assemblyList.parts = await this.partRepository.GetByAssemblyList(assemblyList);
                for (let part of assemblyList.parts) {
                    part.material = await this.materialRepository.GetByPart(part);
                    part.material.priceItems = await this.priceItemRepository.GetByMaterial(part.material);
                }
            }
        }

        return products

    }

    async exportProductPrices(): Promise<string> {

        let products = await this.productRepository.GetAll();
        let productExport = [];

        for (let product of products) {
            product.assemblyLists = await this.assemblyListRepository.GetByProduct(product);
            for (let assemblyList of product.assemblyLists) {
                assemblyList.parts = await this.partRepository.GetByAssemblyList(assemblyList);
                for (let part of assemblyList.parts) {
                    part.material = await this.materialRepository.GetByPart(part);
                    part.material.priceItems = await this.priceItemRepository.GetByMaterial(part.material);
                }
            }


            productExport.push({
                name: product.name,
                model: product.model,
                buyer: product.buyer,
                sellPrice: product.sellPrice,
                manufacturePrice: product.manufacturePrice
            })
        }

        var ws = XLSX.utils.json_to_sheet(productExport);

        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Export Ceníku");

        XLSX.writeFile(wb, "uploads/exportProduktu.xlsx");

        return "uploads/exportProduktu.xlsx"
    }
}
