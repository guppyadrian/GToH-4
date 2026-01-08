import type { Area } from "guppy-lib";
import { Block } from "./block";

export class DecorBlock extends Block {
    constructor(x: number, y: number, w: number, h: number) {
        super(x, y, w, h);
    }

    colliding(_otherArea: Area): boolean {
        return false;
    }
}