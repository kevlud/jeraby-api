import PriceItem from "./PriceItem";
import User from "../user/User";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

export default class PriceList {

    id?: number;

    creator: User;

    importDate: Date;

    description: string;

    priceItems: PriceItem[];

    createdAt: Date;

    updatedAt: Date;

    get itemsCount(): number {
        return this.priceItems.length;
    }

    addPriceItem(priceItem: PriceItem): boolean {
        if (!this.priceItems) this.priceItems = [];
        this.priceItems.push(priceItem);

        priceItem.priceList = this;
        return true;
    }
}
