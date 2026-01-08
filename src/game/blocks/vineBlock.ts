import { DecorBlock } from "../blockModels/decorBlock";

export class VineBlock extends DecorBlock {
    constructor(x: number, y: number, w: number, h: number) {
        super(x, y, w, h);
        this.texture = "vine";
        this.type = "vine";
    }
}