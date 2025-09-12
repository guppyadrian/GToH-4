import { SwapBlock } from "../blockModels/swapBlock";

export class RedBlock extends SwapBlock {
    constructor(x: number, y: number, w: number, h: number) {
        super(x, y, w, h, false);
        this.type = 'red';
        this.texture = 'red-block';
    }
}