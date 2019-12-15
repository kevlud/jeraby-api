import {IPriceItemRepository} from "../../../core/data/IPriceItemRepository";
import PriceItem from "../../../core/model/price_list/PriceItem";
import PriceList from "../../../core/model/price_list/PriceList";
import BaseRepository from "../_base/BaseRepository";
import {PriceItemEntity} from "../../schema/price_list/PriceItemSchema";
import {injectable} from "inversify";
import DatabaseProvider from "../../DatabaseProvider";
import Material from "../../../core/model/material/Material";

@injectable()
export default class PriceItemRepository extends BaseRepository<PriceItem> implements IPriceItemRepository {

    protected tableAlias = 'priceItem';
    protected keys: string[] = ['priceItem.id', 'priceItem.pricePerMeter', 'priceItem.pricePerKilo', 'priceItem.materialId', 'priceItem.priceListId'];
    protected exclusiveKey: string = 'pricePerKilo';
    protected exclusiveKeyCombination: string[] = ['pricePerMeter', 'pricePerKilo', 'materialId', 'priceListId'];

    constructor(db: DatabaseProvider) {
        super();
        this.dbManager = db.getRepository(PriceItemEntity);
    }

    async GetByPriceList(priceList: PriceList): Promise<PriceItem[]> {

        let dataRows = await this.dbManager.createQueryBuilder(this.tableAlias)
            .select(this.keys)
            .where("priceListId = :priceListId", {priceListId: priceList.id})
            .getRawMany();

        let models: PriceItem[] = [];
        for (const value of dataRows) {
            models.push(await this.toDomainModel(value));
        }

        return models;
    }

    async GetByMaterial(material: Material): Promise<PriceItem[]> {

        let dataRows = await this.dbManager.createQueryBuilder(this.tableAlias)
            .select(this.keys)
            .where("materialId = :materialId", {materialId: material.id})
            .getRawMany();

        let models: PriceItem[] = [];
        for (const value of dataRows) {
            models.push(await this.toDomainModel(value));
        }

        return models;
    }


    async toDomainModel(dataRow: any): Promise<PriceItem> {

        let newDomainModel = new PriceItem();

        if (dataRow.priceItem_id) newDomainModel.id = dataRow.priceItem_id;
        if (dataRow.priceItem_pricePerMeter) newDomainModel.pricePerMeter = dataRow.priceItem_pricePerMeter;
        if (dataRow.priceItem_pricePerKilo) newDomainModel.pricePerKilo = dataRow.priceItem_pricePerKilo;
        //if (dataRow.priceItem_priceListId) newDomainModel.priceList =

        if (dataRow.priceItem_materialId) newDomainModel.materialId = dataRow.priceItem_materialId;

        return newDomainModel;
    }
}
