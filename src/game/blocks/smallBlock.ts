import { ScaleBlock } from "../blockModels/scaleBlock";

export class SmallBlock extends ScaleBlock {
    constructor(x: number, y: number, w: number, h: number) {
        super(x, y, w, h, 5, 5);
        this.texture = "small-block";
        this.type = "small";
    }
}