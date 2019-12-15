import PriceList from "./PriceList";
import Material from "../material/Material";

export default class PriceItem {

    id?: number;

    pricePerMeter: number;

    pricePerKilo: number;

    priceList: PriceList;

    materialId: number;

    material: Material;

}
