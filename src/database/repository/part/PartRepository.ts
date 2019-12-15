import {IPartRepository} from "../../../core/data/IPartRepository";
import Part from "../../../core/model/part/Part";
import {MOVISERROR} from "../../../MOVIS_Errors";
import Dimensions from "../../../core/model/Dimensions";
import AssemblyList from "../../../core/model/assembly_list/AssemblyList";
import BaseRepository from "../_base/BaseRepository";
import {PartEntity} from "../../schema/part/PartSchema";
import {injectable} from "inversify";
import DatabaseProvider from "../../DatabaseProvider";

@injectable()
export default class PartRepository extends BaseRepository<Part> implements IPartRepository {

    protected tableAlias = 'part';
    protected keys: string[] = ['part.id', 'part.weight', 'part.width', 'part.height', 'part.length', 'part.thickness', "part.materialId", "part.assemblyListId"];
    protected exclusiveKey: string = 'id';
    protected exclusiveKeyCombination: string[] = ['weight', "height", "length", "thickness", "materialId", "assemblyListId"];


    constructor(db: DatabaseProvider) {
        super();
        this.dbManager = db.getRepository(PartEntity);
    }

    async GetByAssemblyList(assemblyList: AssemblyList): Promise<Part[]> {

        let dataRows = await this.dbManager.createQueryBuilder(this.tableAlias)
            .select(this.keys)
            .where("assemblyListId = :assemblyListId", {assemblyListId: assemblyList.id})
            .getRawMany();

        let models: Part[] = [];
        for (const value of dataRows) {
            models.push(await this.toDomainModel(value));
        }

        return models;

    }

    async GetByNominalSize(nominalSize: Dimensions): Promise<Part> {
        /// TODO: Dopsat switch pro různé druhy typů materiálu a podle toho složit query

        let entityORM = await this.dbManager.findOne({
            where: {
                x: nominalSize.x, y: nominalSize.y, z: nominalSize.z, t: nominalSize.t
            }
        });

        if (entityORM == undefined)
            throw new MOVISERROR('Part with nominal size \'' + nominalSize + '\' not found.');
        else
            return entityORM
    }

    async GetBySerial(serial: string): Promise<Part> {
        let entityORM = await this.dbManager.findOne({
            where: {serial: serial}
        });

        if (entityORM == undefined)
            throw new MOVISERROR('Part with serial \'' + serial + '\' not found.');
        else
            return entityORM
    }


    async DeleteByAssemblyList(assemblyList: AssemblyList): Promise<boolean> {
        await this.dbManager.createQueryBuilder(this.tableAlias)
            .delete()
            .from(this.tableAlias)
            .where("assemblyListId = :assemblyListId", {assemblyListId: assemblyList.id})
            .execute();

        return true;
    }

    async toDomainModel(dataRow: any): Promise<Part> {

        let newDomainModel = new Part();

        if (dataRow.part_id) newDomainModel.id = dataRow.part_id;
        if (dataRow.part_weight) newDomainModel.weight = dataRow.part_weight;
        if (dataRow.part_height) newDomainModel.height = dataRow.part_height;
        if (dataRow.part_width) newDomainModel.width = dataRow.part_width;
        if (dataRow.part_length) newDomainModel.length = dataRow.part_length;
        if (dataRow.part_thickness) newDomainModel.thickness = dataRow.part_thickness;

        if (dataRow.part_materialId) newDomainModel.materialId = dataRow.part_materialId;

        return newDomainModel;
    }
}

