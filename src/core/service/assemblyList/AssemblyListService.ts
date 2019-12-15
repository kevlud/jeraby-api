import {inject, injectable} from "inversify";
import IAssemblyListImportEntry from "./IAssemblyListImportEntry";
import * as fs from "fs";
import AssemblyList from "../../model/assembly_list/AssemblyList";
import * as XLSX from 'xlsx';
import {IAssemblyListRepository} from "../../data/IAssemblyListRepository";
import Part from "../../model/part/Part";
import Material from "../../model/material/Material";
import {IMaterialRepository} from "../../data/IMaterialRepository";
import {IPartRepository} from "../../data/IPartRepository";
import Product from "../../model/product/Product";

const {read, write, utils} = XLSX;


@injectable()
export default class AssemblyListService {


    @inject("IAssemblyListRepository")
    private assemblyListRepository: IAssemblyListRepository;
    @inject("IMaterialRepository")
    private materialRepository: IMaterialRepository;
    @inject("IPartRepository")
    private partRepository: IPartRepository;


    async getAssemblyListById(idAssemblyList: number): Promise<AssemblyList> {
        //console.log(await this.assemblyListRepository.GetById(idAssemblyList))
        return this.assemblyListRepository.GetById(idAssemblyList).catch(reason => Promise.reject(reason));

    }

    async getAllAssemblyLists(first: number, offset: number = 0): Promise<AssemblyList[]> {
        return await this.assemblyListRepository.GetAll();
    }

    async getByAssemblyListsByProduct(product: Product) {
        return this.assemblyListRepository.GetByProduct(product).catch(reason => Promise.reject(reason));
    }


    async importAssemblyListFromXls(filename: string, assemblyListId?: string): Promise<boolean> {

        if (!fs.existsSync(filename)) Promise.resolve(false);

        var workbook = XLSX.readFile(filename, {type: "array"});
        var worksheet = workbook.Sheets[workbook.SheetNames[0]];

        let importEntries: IAssemblyListImportEntry[] = utils.sheet_to_json(worksheet, {
            header: [
                "materialId",
                "height",
                "width",
                "length",
                "thickness",
            ]
        });

        fs.writeFile(`${filename}.json`, JSON.stringify(importEntries), 'utf8', (s) => {
            console.log(s);
        });


        let newAssemblyList = new AssemblyList();


        for (let entry of importEntries) {
            if (typeof entry.materialId == "undefined") continue;
            else if (typeof entry.materialId == "string" && entry.materialId == "ID Materiálu") continue;
            else if (typeof entry.materialId == "string") {
                //newAssemblyList.id = await this.assemblyListRepository.NextPrimaryKey();
                newAssemblyList.name = entry.materialId;
                newAssemblyList = await this.assemblyListRepository.Save(newAssemblyList);

                await this.partRepository.DeleteByAssemblyList(newAssemblyList);
                continue;
            }

            let material: Material;
            try {
                material = await this.materialRepository.GetById(entry.materialId);
            } catch (e) {
                console.warn("Material with id " + entry.materialId + " not found.");
                continue;
            }

            let newPart = new Part();
            newPart.height = entry.height;
            newPart.width = entry.width;
            newPart.length = entry.length;
            newPart.thickness = entry.thickness;
            newPart.materialId = (material.id != undefined) ? material.id : 0;
            newPart.material = material;

            newPart.assemblyListId = (newAssemblyList.id != undefined) ? newAssemblyList.id : 0;
            newPart.assemblyList = newAssemblyList;


            await this.partRepository.Save(newPart);
            console.log(entry)


        }

        return Promise.resolve(true);

    }


}
