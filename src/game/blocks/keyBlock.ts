import { CollectableBlock } from "../blockModels/collectableBlock";

export class KeyBlock extends CollectableBlock {
    constructor(x: number, y: number, w: number, h: number) {
        super(x, y, w, h, 'key0');
        this.texture = "key0";
        this.type = "key";
    }
}