import {IPriceListRepository} from "../../../core/data/IPriceListRepository";
import PriceList from "../../../core/model/price_list/PriceList";
import {MOVISERROR} from "../../../MOVIS_Errors";
import User from "../../../core/model/user/User";
import BaseRepository from "../_base/BaseRepository";
import {PriceListEntity} from "../../schema/price_list/PriceListSchema";
import {injectable} from "inversify";
import DatabaseProvider from "../../DatabaseProvider";

@injectable()
export default class PriceListRepository extends BaseRepository<PriceList> implements IPriceListRepository {

    protected tableAlias = 'priceList';
    protected keys: string[] = ['priceList.id', 'priceList.creatorId', 'priceList.importDate', 'priceList.description'];
    protected exclusiveKey: string = 'description';
    protected exclusiveKeyCombination: string[] = ['creatorId', 'description'];

    constructor(db: DatabaseProvider) {
        super();
        this.dbManager = db.getRepository(PriceListEntity);
    }

    async GetByCreator(creator: User): Promise<PriceList> {
        let priceListORM = await this.dbManager.findOne({
            where: {
                creator: creator
            }
        });

        if (priceListORM == undefined)
            throw new MOVISERROR('PriceList with creator \'' + creator.email + '\' not found.');
        else
            return priceListORM;
    }

    async GetCurrent(): Promise<PriceList> {
        let dataRow = await this.dbManager.createQueryBuilder(this.tableAlias)
            .select(this.keys)
            .orderBy("id", "DESC")
            .getRawOne();

        console.log(dataRow)
        return await this.toDomainModel(dataRow);


    }


    async toDomainModel(dataRow: any): Promise<PriceList> {

        let newDomainModel = new PriceList();


        if (dataRow.priceList_id) newDomainModel.id = dataRow.priceList_id;
        if (dataRow.priceList_description) newDomainModel.description = dataRow.priceList_description;
        //if (dataRow.priceList_creator) newDomainModel.creator = dataRow.priceList_creator;
        if (dataRow.priceList_importDate) newDomainModel.importDate = dataRow.priceList_importDate;

        return newDomainModel;
    }
}
