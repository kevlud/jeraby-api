import Material from "../material/Material";
import AssemblyList from "../assembly_list/AssemblyList";

export default class Part {

    id?: number;

    weight?: number;

    height?: number;

    width?: number;

    length?: number;

    thickness?: number;

    assemblyListId: number;

    assemblyList: AssemblyList;

    materialId: number;

    material: Material;

    createdAt: Date;

    updatedAt: Date;

    get price() {

        switch (this.material.type) {
            case "plech":
                if (this.length && this.width)
                    return this.material.pricePerMeter * this.length * this.width / 1000000;
                break;
            case "trubka":
                if (this.length)
                    return this.material.pricePerMeter * this.length / 1000;
                break;
        }

        return 0;

    }


}
