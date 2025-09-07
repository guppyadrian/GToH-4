import { Assets } from "./assets";
import { Master } from "./master";
import { Vector2 } from "./vector2";

export class Sprite {
    pos;
    vel;
    image;

    get x() {
        return this.pos.x;
    }
    set x(x) {
        this.pos.x = x;
    }

    get y() {
        return this.pos.y;
    }
    set y(y) {
        this.pos.y = y;
    }

    static from(filePath) {
        return new this(Assets.get(filePath), 0, 0);
    }

    constructor(image, x, y) {
        this.pos = new Vector2(x, y);
        this.vel = Vector2.zero;
        this.image = image;
    }

    update() {
        this.pos.add(this.vel);
    }

    draw() {
        Master.draw(this.image, this.x, this.y);
    }
}