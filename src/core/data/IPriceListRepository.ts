import {IBaseRepository} from "./IBaseRepository";
import PriceList from "../model/price_list/PriceList";
import User from "../model/user/User";

export interface IPriceListRepository extends IBaseRepository<PriceList> {

    GetByCreator(creator: User): Promise<PriceList>

    GetCurrent(): Promise<PriceList>


}
