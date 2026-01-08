import type { Area } from "guppy-lib";
import { Block } from "./block";
import type { Sprite } from "guppy-lib";
import { Vector2 } from "guppy-lib";

export abstract class ForceBlock extends Block {

    forceX;
    forceY;
    
    constructor(x: number, y: number, w: number, h: number, vx: number, vy: number) {
        super(x, y, w, h);

        this.type = 'bounce';
        this.texture = 'bounce-up';
        this.forceX = vx;
        this.forceY = vy;
    }

    colliding(otherArea: Sprite, firstCheck = false): boolean {
        if (!super.colliding(otherArea)) return false;

        if (firstCheck) {
            otherArea.vx = this.forceX || otherArea.vx;
            otherArea.vy = this.forceY || otherArea.vy;
        }

        return false;
    }
}