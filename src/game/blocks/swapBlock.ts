import { Block } from "../block";

export class SwapBlock extends Block {
    constructor(x: number, y: number, w: number, h: number) {
        super(x, y, w, h);
        this.type = "swapBlock"
    }
}