import {IBaseRepository} from "./IBaseRepository";
import AssemblyList from "../model/assembly_list/AssemblyList";
import Product from "../model/product/Product";

export interface IAssemblyListRepository extends IBaseRepository<AssemblyList> {

    GetByProduct(product: Product): Promise<AssemblyList[]>
}
