import {IBaseRepository} from "./IBaseRepository";
import PriceItem from "../model/price_list/PriceItem";
import PriceList from "../model/price_list/PriceList";
import Material from "../model/material/Material";

export interface IPriceItemRepository extends IBaseRepository<PriceItem> {

    GetByPriceList(priceList: PriceList): Promise<PriceItem[]>

    GetByMaterial(material: Material): Promise<PriceItem[]>

}
