import { ForceBlock } from "../blockModels/forceBlock";

export class BounceBlock extends ForceBlock {
    constructor(x: number, y: number, w: number, h: number) {
        super(x, y, w, h, 0, -20);

        this.type = 'bounce';
        this.texture = 'bounce-up';
    }
}