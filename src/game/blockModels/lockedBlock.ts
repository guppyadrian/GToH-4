import type { Area } from "guppy-lib";
import { Block } from "./block";
import { GameState } from "../../scenes/gameScene";

export class LockedBlock extends Block {
    item;

    constructor(x: number, y: number, w: number, h: number, item: string) {
        super(x, y, w, h);
        this.type = 'door';
        this.item = item;
    }

    colliding(otherArea: Area): boolean {
        if (super.colliding(otherArea)) {
            if (this.item in GameState.inventory) return false;

            return true;
        }

        return false;
    }
}