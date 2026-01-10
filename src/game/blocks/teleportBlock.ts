import { Vector2, type Area } from "guppy-lib";
import { Block } from "../blockModels/block";

export class TeleportBlock extends Block {
    tpPos: Vector2;

    constructor(x: number, y: number, w: number, h: number, tags: number[]) {
        super(x, y, w, h);
        this.texture = "green-portal";
        this.type = "tp";

        this.tpPos = new Vector2(tags[0], tags[1]);
    }

    colliding(otherArea: Area, _firstCheck?: boolean): boolean {
        if (!super.colliding(otherArea)) return false;

        otherArea.x = this.tpPos.x;
        otherArea.y = this.tpPos.y;

        return true;
    }
}