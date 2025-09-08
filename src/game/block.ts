// so this is a group of blocks all at once, so a collision check will just check this group instead of a ton of blocks.

import { Area, Camera, Master } from "guppy-lib"

export class Block extends Area {
    type;
    tilesX;
    tilesY;

    get width() {
        return this.size.x * this.tilesX;
    }
    get height() {
        return this.size.y * this.tilesY;
    }

    constructor(x = 0, y = 0, type = 'block', w = 1, h = 1) {
        super(x, y, 30, 30);
        this.type = type;
        this.tilesX = w; // how many columns it has
        this.tilesY = h; // how many rows it has
    }

    draw() {
        const ctx = Master.ctx;

        const screenPos = Camera.toScreen(this.pos);

        ctx.fillRect(screenPos.x, screenPos.y, this.width, this.height);
    }
}