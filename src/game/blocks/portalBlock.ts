import { StatusBlock } from "../blockModels/statusBlock";
import type { Player } from "../player";

export class PortalBlock extends StatusBlock {
    nextLevel;
    constructor(x: number, y: number, w: number, h: number, tags: number[]) { // TODO: figure out how to make tags convert from old
        super (x, y, w, h, 'portal');
        this.type = 'portal';
        this.texture = 'green-portal'

        this.nextLevel = tags[0];
    }

    colliding(otherArea: Player): boolean {
        if (!super.colliding(otherArea)) return false;

        otherArea.nextLevel = this.nextLevel;

        return false;
    }
}