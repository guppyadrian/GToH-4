import { StatusBlock } from "../blockModels/statusBlock";
import type { Player } from "../player";

export class MudBlock extends StatusBlock {
    constructor(x: number, y: number, w: number, h: number) {
        super(x, y, w, h, 'mud');
        this.texture = "mud-block";
        this.type = "mud";
    }

    colliding(otherArea: Player): boolean {
        super.colliding(otherArea);
        return false;
    }
}