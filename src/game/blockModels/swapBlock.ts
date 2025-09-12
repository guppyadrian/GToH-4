import type { Area } from "guppy-lib";
import { Block } from "./block";

export abstract class SwapBlock extends Block {
    active: boolean;
    inverted: boolean;

    constructor(x: number, y: number, w: number, h: number, inverted: boolean) {
        super(x, y, w, h);
        this.type = "swapBlock";
        this.texture = "error";
        this.inverted = inverted;
        this.active = !inverted;
    }

    colliding(otherArea: Area): boolean {
        if (!this.active) return true;

        return super.colliding(otherArea);
    }
}