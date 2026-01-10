import { ForceBlock } from "../blockModels/forceBlock";

export class BounceRightBlock extends ForceBlock {
    constructor(x: number, y: number, w: number, h: number) {
        super(x, y, w, h, 20, 0);

        this.type = 'rbounce';
        this.texture = 'bounce-right';
    }
}