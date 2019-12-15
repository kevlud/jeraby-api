import {IPriceListRepository} from "../../data/IPriceListRepository";
import AuthService from "../AuthService";
import {IMaterialRepository} from "../../data/IMaterialRepository";
import * as XLSX from 'xlsx';
import * as fs from "fs";
import IPriceListImportEntry from "./IPriceListImportEntry";
import PriceList from "../../model/price_list/PriceList";
import PriceItem from "../../model/price_list/PriceItem";
import Material from "../../model/material/Material";
import {IPriceItemRepository} from "../../data/IPriceItemRepository";
import {inject, injectable} from "inversify";

const {read, write, utils} = XLSX;


@injectable()
export default class PriceListService {

    @inject("IPriceListRepository")
    private priceListRepository: IPriceListRepository;
    @inject("IPriceItemRepository")
    private priceItemRepository: IPriceItemRepository;
    @inject("IMaterialRepository")
    private materialRepository: IMaterialRepository;


    @inject(AuthService)
    private authService: AuthService;


    async getCurrentPriceList(): Promise<PriceList> {
        return this.priceListRepository.GetCurrent().catch(reason => Promise.reject(reason));
    }

    async getPriceListById(idPriceList: number): Promise<PriceList> {
        return this.priceListRepository.GetById(idPriceList).catch(reason => Promise.reject(reason));
    }

    async getAllPriceLists(): Promise<PriceList[]> {
        return await this.priceListRepository.GetAll();
    }


    async importPriceListFromXls(filename: string): Promise<boolean> {

        if (!fs.existsSync(filename)) Promise.resolve(false);

        var workbook = XLSX.readFile(filename, {type: "array"});
        var worksheet = workbook.Sheets[workbook.SheetNames[0]];

        let importEntries: IPriceListImportEntry[] = utils.sheet_to_json(worksheet, {
            header: [
                "materialId",
                "pricePerKilo",
                "pricePerMeter",
                "type",
                "weight",
                "height",
                "width",
                "length",
                "thickness",
            ]
        });

        fs.writeFile(`${filename}.json`, JSON.stringify(importEntries), 'utf8', (s) => {
            console.log(s);
        });


        let newPriceList = new PriceList();
        newPriceList.id = await this.priceListRepository.NextPrimaryKey();
        newPriceList.creator = this.authService.currentUser;
        newPriceList.importDate = new Date();
        newPriceList.description = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        newPriceList = await this.priceListRepository.Save(newPriceList);


        let newPriceItem;
        for (let entry of importEntries) {
            if (typeof entry.materialId == "string") continue;

            let material: Material = new Material();
            material.id = entry.materialId;
            material.type = entry.type;
            material.weight = entry.weight;
            material.height = entry.height;
            material.width = entry.width;
            material.length = entry.length;
            material.thickness = entry.thickness;
            material = await this.materialRepository.Save(material);


            newPriceItem = new PriceItem();
            newPriceItem.id = await this.priceItemRepository.NextPrimaryKey();
            newPriceItem.priceList = newPriceList;
            newPriceItem.pricePerKilo = entry.pricePerKilo;
            newPriceItem.pricePerMeter = entry.pricePerMeter;
            newPriceItem.material = material;
            newPriceItem = await this.priceItemRepository.Save(newPriceItem);
            newPriceList.addPriceItem(newPriceItem);
        }

        return Promise.resolve(true);

    }

}
