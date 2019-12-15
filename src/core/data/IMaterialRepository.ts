import {IBaseRepository} from "./IBaseRepository";
import Material from "../model/material/Material";
import PriceList from "../model/price_list/PriceList";
import Part from "../model/part/Part";
import PriceItem from "../model/price_list/PriceItem";

export interface IMaterialRepository extends IBaseRepository<Material> {

    GetAllWithoutPriceItem(currentPriceList?: PriceList): Promise<Material[]>

    GetAllWithPriceItem(currentPriceList?: PriceList): Promise<Material[]>

    GetByPart(part: Part): Promise<Material>

    GetByPriceItem(priceItem: PriceItem): Promise<Material>

    GetBySerial(serial: string): Promise<Material>

}
