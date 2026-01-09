import { Block } from "./block";

export class ScaleBlock extends Block {
    constructor(x: number, y: number, w: number, h: number, blockW: number, blockH: number) {
        super(x, y, w, h);
        this.size.x = blockW;
        this.size.y = blockH;
    }
}