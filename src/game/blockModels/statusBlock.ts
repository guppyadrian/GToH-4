import { Block } from "./block";
import type { Player } from "../player";

export abstract class StatusBlock extends Block {
    status;

    constructor(x: number, y: number, w: number, h: number, status: string) {
        super(x, y, w, h);

        this.status = status;
    }

    colliding(otherArea: Player): boolean {
        if (!super.colliding(otherArea)) return false;

        otherArea.addStatus(this.status);

        return true;
    }
}