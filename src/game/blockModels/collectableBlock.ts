import type { Area } from "guppy-lib";
import { Block } from "./block";
import { GameState } from "../../scenes/gameScene";

export class CollectableBlock extends Block {
    item;

    constructor(x: number, y: number, w: number, h: number, item: string) {
        super(x, y, w, h);
        this.type = 'key';
        this.item = item;
    }

    colliding(otherArea: Area): boolean {
        if (super.colliding(otherArea)) {
            GameState.inventory[this.item] = true;

            return true;
        }

        return false;
    }
}