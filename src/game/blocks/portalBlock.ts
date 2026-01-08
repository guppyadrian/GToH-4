import { Canvas } from "guppy-lib";
import { StatusBlock } from "../blockModels/statusBlock";
import type { Player } from "../player";
import { GetLevel } from "../levels";

export class PortalBlock extends StatusBlock {
    nextLevel;
    levelName;

    constructor(x: number, y: number, w: number, h: number, tags: number[]) { // TODO: figure out how to make tags convert from old
        super (x, y, w, h, 'portal');
        this.type = 'portal';
        this.texture = 'green-portal'

        this.nextLevel = tags[0];
        try {
            this.levelName = GetLevel(tags[0]).about!.name; // TODO: be safe. Remove the exclamation mark!!!!
        }
        catch {
            this.levelName = "ERROR";
        }
    }

    colliding(otherArea: Player): boolean {
        if (!super.colliding(otherArea)) return false;

        otherArea.nextLevel = this.nextLevel;

        return false;
    }

    draw() {
        super.draw();

        Canvas.drawText(this.levelName, this.center.x, this.center.y - 30, 10);
    }
}