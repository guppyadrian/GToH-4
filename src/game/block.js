// so this is a group of blocks all at once, so a collision check will just check this group instead of a ton of blocks.

export class Block {

    get width() {
        return this.tileWidth * this.tilesX;
    }
    get height() {
        return this.tileHeight * this.tilesY;
    }

    constructor() {
        this.type = 'block';
        this.x = 0;
        this.y = 0;
        this.tilesX = 1; // how many columns it has
        this.tilesY = 1; // how many rows it has
        this.tileWidth = 30;
        this.tileHeight = 30;
    }
}