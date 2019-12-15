import {IMaterialRepository} from "../../../core/data/IMaterialRepository";
import Material from "../../../core/model/material/Material";
import {MOVISERROR} from "../../../MOVIS_Errors";
import BaseRepository from "../_base/BaseRepository";
import PriceList from "../../../core/model/price_list/PriceList";
import {MaterialEntity} from "../../schema/material/MaterialSchema";
import {injectable} from "inversify";
import DatabaseProvider from "../../DatabaseProvider";
import Part from "../../../core/model/part/Part";
import PriceItem from "../../../core/model/price_list/PriceItem";

@injectable()
export default class MaterialRepository extends BaseRepository<Material> implements IMaterialRepository {

    protected tableAlias = 'material';
    protected keys: string[] = ['material.id', 'material.type', 'material.weight', 'material.width', 'material.height', 'material.length', 'material.thickness'];
    protected exclusiveKey: string = 'id';
    protected exclusiveKeyCombination: string[] = ['type', 'width', 'height', 'length', 'thickness'];


    constructor(db: DatabaseProvider) {
        super();
        this.dbManager = db.getRepository(MaterialEntity);
    }

    async GetAllWithPriceItem(currentPriceList?: PriceList): Promise<Material[]> {
        if (currentPriceList == undefined)
            return await this.dbManager
                .createQueryBuilder("material")
                .leftJoinAndSelect("material.quality", "quality")
                .leftJoinAndSelect("material.type", "type")
                .leftJoinAndSelect("material.priceItems", "priceItem")
                .leftJoinAndSelect("priceItem.priceList", "priceList")
                .where("priceItem.materialId IS NOT NULL")
                .getMany();
        else
            return await this.dbManager
                .createQueryBuilder("material")
                .leftJoinAndSelect("material.quality", "quality")
                .leftJoinAndSelect("material.type", "type")
                .leftJoinAndSelect("material.priceItems", "priceItem")
                .leftJoinAndSelect("priceItem.priceList", "priceList")
                .where("priceItem.materialId IS NOT NULL")
                .andWhere("priceList.id = :priceListId", {priceListId: currentPriceList.id})
                .getMany();
    }

    async GetAllWithoutPriceItem(currentPriceList?: PriceList): Promise<Material[]> {
        if (currentPriceList == undefined)
            return await this.dbManager
                .createQueryBuilder("material")
                .leftJoinAndSelect("material.quality", "quality")
                .leftJoinAndSelect("material.type", "type")
                .leftJoinAndSelect("material.priceItems", "priceItem")
                .leftJoinAndSelect("priceItem.priceList", "priceList")
                .where("priceItem.materialId IS NULL")
                .getMany();
        else
            return await this.dbManager
                .createQueryBuilder("material")
                .leftJoinAndSelect("material.quality", "quality")
                .leftJoinAndSelect("material.type", "type")
                .leftJoinAndSelect("material.priceItems", "priceItem")
                .leftJoinAndSelect("priceItem.priceList", "priceList")
                .where("priceItem.materialId IS NULL")
                .getMany();
    }


    async GetByPart(part: Part): Promise<Material> {

        let dataRow = await this.dbManager.createQueryBuilder(this.tableAlias)
            .select(this.keys)
            .where("id = :materialId", {materialId: part.materialId})
            .getRawOne();

        return await this.toDomainModel(dataRow);
    }

    async GetByPriceItem(priceItem: PriceItem): Promise<Material> {

        let dataRow = await this.dbManager.createQueryBuilder(this.tableAlias)
            .select(this.keys)
            .where("id = :materialId", {materialId: priceItem.materialId})
            .getRawOne();

        return await this.toDomainModel(dataRow);
    }

    async GetBySerial(serial: string): Promise<Material> {
        let entityORM = await this.dbManager.findOne({
            where: {serial: serial}
        });

        if (entityORM == undefined)
            throw new MOVISERROR('Material with serial \'' + serial + '\' not found.');
        else
            return entityORM
    }

    async toDomainModel(dataRow: any): Promise<Material> {

        let newDomainModel = new Material();

        if (dataRow.material_id) newDomainModel.id = dataRow.material_id;
        if (dataRow.material_type) newDomainModel.type = dataRow.material_type;
        if (dataRow.material_weight) newDomainModel.weight = dataRow.material_weight;
        if (dataRow.material_height) newDomainModel.height = dataRow.material_height;
        if (dataRow.material_width) newDomainModel.width = dataRow.material_width;
        if (dataRow.material_length) newDomainModel.length = dataRow.material_length;
        if (dataRow.material_thickness) newDomainModel.thickness = dataRow.material_thickness;

        return newDomainModel;
    }
}
