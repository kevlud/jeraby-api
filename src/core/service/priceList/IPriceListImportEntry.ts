export default interface IPriceListImportEntry {

    // For material
    materialId: number;

    // For priceItem
    pricePerMeter: number;
    pricePerKilo: number;

    type: string;
    weight: number;
    height: number;
    width: number;
    length: number;
    thickness: number;
}


