// so this is a group of blocks all at once, so a collision check will just check this group instead of a ton of blocks.
import type { BlockTags } from "../createBlock";
import { Area, Assets, Canvas } from "guppy-lib"

export class Block extends Area {
    type;
    tilesX;
    tilesY;
    image: HTMLImageElement;
    private _texture: string;

    get width() {
        return this.size.x * this.tilesX;
    }
    get height() {
        return this.size.y * this.tilesY;
    }

    set texture(tex: string) {
        this.image = Assets.get(tex);
        this._texture = tex;
    }

    get texture() {
        return this._texture;
    }

    constructor(x = 0, y = 0, w = 1, h = 1, _tags: BlockTags = {}) {
        super(x, y, 30, 30);
        this.type = "block";
        this.tilesX = w; // how many columns it has
        this.tilesY = h; // how many rows it has
        this.image = Assets.get('block');
        this._texture = 'block';
    }

    draw() {
        //Canvas.drawPattern(this.x, this.y, this.width, this.height, this.texture);
        //return;

        for (let x = 0; x < this.tilesX; x++) {
            for (let y = 0; y < this.tilesY; y++) {
                Canvas.draw(
                    this.image,
                    this.x + (x * this.size.x),
                    this.y + (y * this.size.y),
                )
            }
        }
    }

    update() {
        
    }
}