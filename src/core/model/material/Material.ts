import PriceItem from "../price_list/PriceItem";
import Part from "../part/Part";

export default class Material {

    id?: number;

    type: string;

    weight?: number;

    height?: number;

    width?: number;

    length?: number;

    thickness?: number;

    priceItems: PriceItem[];

    parts: Part[];
    createdAt: Date;

    updatedAt: Date;

    get pricePerMeter(): number {
        if (this.priceItems && this.priceItems[this.priceItems.length - 1])
            return this.priceItems[this.priceItems.length - 1].pricePerMeter;
        else
            return 0;
    }

    get pricePerKilo(): number {

        if (this.priceItems && this.priceItems[this.priceItems.length - 1])
            return this.priceItems[this.priceItems.length - 1].pricePerKilo;
        else
            return 0;
    }

}
