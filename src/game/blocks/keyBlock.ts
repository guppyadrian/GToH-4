import { CollectableBlock } from "../blockModels/collectableBlock";

export class KeyBlock extends CollectableBlock {
    constructor(x: number, y: number, w: number, h: number, tags: string[]) {
        super(x, y, w, h, tags[0]);
        this.texture = tags[0];
        this.type = "key";
    }
}