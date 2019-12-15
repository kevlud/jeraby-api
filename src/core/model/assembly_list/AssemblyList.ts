import Product from "../product/Product";
import Part from "../part/Part";


export default class AssemblyList {

    id?: number;

    name?: string;

    createdAt: Date;

    updatedAt: Date;

    product: Product;

    parts: Part[];


    get weight(): number {
        let sumOfWeights = 0;

        for (let part of this.parts)
            if (part.weight)
                sumOfWeights += part.weight;

        return sumOfWeights;
    }

    get manufacturePrice(): number {

        let sumOfPrices = 0;

        for (let part of this.parts)
            sumOfPrices += part.price;

        return sumOfPrices;
    }
}
