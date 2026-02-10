import { Block } from "../blockModels/block";
import type { Player } from "../player";

export class GravityReverseBlock extends Block {
    constructor(x: number, y: number, w: number, h: number) {
        super(x, y, w, h);
        this.texture = "reverse-gravity-block";
        this.type = "greverse";
    }

    colliding(otherArea: Player, _firstCheck?: boolean): boolean {
        if (!super.colliding(otherArea)) return false;

        otherArea.gravityDir = -1;

        return false;
    }
}