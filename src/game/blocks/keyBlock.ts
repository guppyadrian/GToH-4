import { CollectableBlock } from "../blockModels/collectableBlock";
import { World } from "../world";

export class KeyBlock extends CollectableBlock {
    constructor(x: number, y: number, w: number, h: number, tags: (string | number)[]) {
        const keyName: string = (World.format === 1) ? (tags[0] as string) : ('key' + tags[0])
        super(x, y, w, h, keyName);
        this.texture = keyName;
        this.type = "key";
    }
}