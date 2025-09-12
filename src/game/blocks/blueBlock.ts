import { SwapBlock } from "../blockModels/swapBlock";

export class BlueBlock extends SwapBlock {
    constructor(x: number, y: number, w: number, h: number) {
        super(x, y, w, h, true);
        this.type = 'blue';
        this.texture = 'blue-block';
    }
}