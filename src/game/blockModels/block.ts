// so this is a group of blocks all at once, so a collision check will just check this group instead of a ton of blocks.
import type { BlockTags } from "../createBlock";
import { Area, Canvas } from "guppy-lib"

export class Block extends Area {
    type;
    tilesX;
    tilesY;
    texture: string;

    get width() {
        return this.size.x * this.tilesX;
    }
    get height() {
        return this.size.y * this.tilesY;
    }

    constructor(x = 0, y = 0, w = 1, h = 1, _tags: BlockTags = {}) {
        super(x, y, 30, 30);
        this.type = "block";
        this.tilesX = w; // how many columns it has
        this.tilesY = h; // how many rows it has
        this.texture = 'block';
    }

    draw() {
        Canvas.drawPattern(this.x, this.y, this.width, this.height, 'metal-block')
    }

    update() {
        
    }
}