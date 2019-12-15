import {IBaseRepository} from "./IBaseRepository";
import Part from "../model/part/Part";
import AssemblyList from "../model/assembly_list/AssemblyList";

export interface IPartRepository extends IBaseRepository<Part> {

    GetByAssemblyList(assemblyList: AssemblyList): Promise<Part[]>

    DeleteByAssemblyList(assemblyList: AssemblyList): Promise<boolean>

}
