import BaseRepository from "../_base/BaseRepository";
import AssemblyList from "../../../core/model/assembly_list/AssemblyList";
import {AssemblyListEntity} from "../../schema/assembly_list/AssemblyListSchema";
import {injectable} from "inversify";
import DatabaseProvider from "../../DatabaseProvider";
import Product from "../../../core/model/product/Product";

@injectable()
export default class AssemblyListRepository extends BaseRepository<AssemblyList> {

    protected tableAlias = 'assemblyList';
    protected keys: string[] = ['assemblyList.id', 'assemblyList.name', 'assemblyList.productId'];
    protected exclusiveKey: string = 'name';
    protected exclusiveKeyCombination: string[] = ['name'];

    constructor(db: DatabaseProvider) {
        super();
        this.dbManager = db.getRepository(AssemblyListEntity);
    }

    async GetByProduct(product: Product): Promise<AssemblyList[]> {

        let dataRows = await this.dbManager.createQueryBuilder(this.tableAlias)
            .select(this.keys)
            .where("productId = :productId", {productId: product.id})
            .getRawMany();

        let models: AssemblyList[] = [];
        for (const value of dataRows) {
            models.push(await this.toDomainModel(value));
        }

        return models;
    }

    async toDomainModel(dataRow: any): Promise<AssemblyList> {

        let newDomainModel = new AssemblyList();

        if (dataRow.assemblyList_id) newDomainModel.id = dataRow.assemblyList_id;
        if (dataRow.assemblyList_name) newDomainModel.name = dataRow.assemblyList_name;

        return newDomainModel;
    }
}

