import { StatusBlock } from "../blockModels/statusBlock";

export class MetalBlock extends StatusBlock {
    constructor(x: number, y: number, w: number, h: number) {
        super(x, y, w, h, 'no-wj');

        this.type = 'metal';
        this.texture = 'metal-block';
    }
}