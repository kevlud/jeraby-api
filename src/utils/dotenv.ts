import dotenv from "dotenv";

dotenv.config();
let path;
switch (process.env.NODE_ENV) {
    case "production":
        path = `${__dirname}/../../.env`;
        break;
    default:
        path = `${__dirname}/../../development.env`;
}
dotenv.config({path: path});

export const APP_ID = process.env.APP_ID;
export const LOG_LEVEL = process.env.LOG_LEVEL;
export const STEEL_DENSITY: number = (process.env.STEEL_DENSITY) ? parseFloat(process.env.STEEL_DENSITY) : 8;
