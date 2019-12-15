import utility from "../../utils/utility";

export default class Dimensions {

    t?: number;
    x?: number;
    y?: number;
    z?: number;


    constructor(thickness: number | undefined, x: number | undefined, y: number | undefined, z: number | undefined) {
        this.t = (thickness) ? thickness : 0;
        this.x = (x) ? x : 0;
        this.y = (y) ? y : 0;
        this.z = (z) ? z : 0;


    }

    static safeParse(t: number | string | undefined, x: number | string | undefined, y: number | string | undefined, z: number | string | undefined): Dimensions {

        let pt = 0, px = 0, py = 0, pz = 0;

        if (typeof t == "string")
            pt = parseInt(utility.keepOnlyDigits(t)) || 0;
        if (typeof x == "string")
            px = parseInt(utility.keepOnlyDigits(x)) || 0;
        if (typeof y == "string")
            py = parseInt(utility.keepOnlyDigits(y)) || 0;
        if (typeof z == "string")
            pz = parseInt(utility.keepOnlyDigits(z)) || 0;


        if (typeof t == "number")
            pt = t;
        if (typeof x == "number")
            px = x;
        if (typeof y == "number")
            py = y;
        if (typeof z == "number")
            pz = z;

        return new Dimensions(pt, px, py, pz);
    }

    public compareTo(d: Dimensions): boolean {

        return (this.t == d.t && this.x == d.x && this.y == d.y && this.z == d.z)
    }
}
