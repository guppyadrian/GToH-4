import { StatusBlock } from "../blockModels/statusBlock";
import type { Player } from "../player";

export class WinBlock extends StatusBlock {
    constructor(x: number, y: number, w: number, h: number) {
        super(x, y, w, h, 'win');
        this.texture = "yellow-block";
        this.type = "win";
    }

    colliding(otherArea: Player): boolean {
        super.colliding(otherArea);

        return false;
    }
}