import BaseRepository from "../_base/BaseRepository";
import Product from "../../../core/model/product/Product";
import {ProductEntity} from "../../schema/product/ProductSchema";
import {injectable} from "inversify";
import DatabaseProvider from "../../DatabaseProvider";

@injectable()
export default class ProductRepository extends BaseRepository<Product> {

    protected tableAlias = 'product';
    protected keys: string[] = ['product.id', 'product.name', 'product.model', 'product.buyer', 'product.sellPrice', 'product.weight'];
    protected exclusiveKey: string = 'model';
    protected exclusiveKeyCombination: string[] = ['name', 'model'];

    constructor(db: DatabaseProvider) {
        super();
        this.dbManager = db.getRepository(ProductEntity);
    }

    async toDomainModel(dataRow: any): Promise<Product> {

        let newDomainModel = new Product();

        if (dataRow.product_id) newDomainModel.id = dataRow.product_id;
        if (dataRow.product_name) newDomainModel.name = dataRow.product_name;
        if (dataRow.product_model) newDomainModel.model = dataRow.product_model;
        if (dataRow.product_buyer) newDomainModel.buyer = dataRow.product_buyer;
        if (dataRow.product_sellPrice) newDomainModel.sellPrice = dataRow.product_sellPrice;
        if (dataRow.product_weight) newDomainModel.weight = dataRow.product_weight;

        return newDomainModel;
    }

}

