// so this is a group of blocks all at once, so a collision check will just check this group instead of a ton of blocks.

import { Area, Camera, Master } from "guppy-lib"
import type { BlockTags } from "../createBlock";

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
        const ctx = Master.ctx;

        const screenPos = Camera.toScreen(this.pos);

        ctx.fillRect(screenPos.x, screenPos.y, this.width, this.height);
    }

    update() {
        
    }
}