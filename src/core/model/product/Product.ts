import AssemblyList from "../assembly_list/AssemblyList";

export default class Product {

    id?: number;

    name: string;

    model: string;

    buyer: string;

    sellPrice: number;

    weight: number;

    createdAt: Date;

    updatedAt: Date;

    assemblyLists: AssemblyList[];

    get manufacturePrice(): number {
        let price = 0;
        for (let assembly of this.assemblyLists)
            price += assembly.manufacturePrice;

        return price;
    }
}
