import { Canvas } from "guppy-lib";
import { StatusBlock } from "../blockModels/statusBlock";
import type { Player } from "../player";
import { GetLevel } from "../levels";

export class PortalBlock extends StatusBlock {
    nextLevel;
    levelName;
    levelDifficulty;
    levelCreator;

    constructor(x: number, y: number, w: number, h: number, tags: number[]) { // TODO: figure out how to make tags convert from old
        super (x, y, w, h, 'portal');
        this.type = 'portal';
        this.texture = 'green-portal'

        this.nextLevel = tags[0];
        const level = GetLevel(tags[0])?.about;
        if (level)
        {
            this.levelName = level.name || '';
            this.levelDifficulty = level.diff || '';
            this.levelCreator = level.create ? 'By ' + level.create : '';
        }
        else
        {
            this.levelName = "ERROR";
            this.levelCreator = "";
            this.levelDifficulty = "";
        }
    }

    colliding(otherArea: Player): boolean {
        if (!super.colliding(otherArea)) return false;

        otherArea.nextLevel = this.nextLevel;

        return false;
    }

    draw() {
        super.draw();

        Canvas.drawText(this.levelName, this.center.x, this.center.y - 35, 8);
        Canvas.drawText(this.levelDifficulty, this.center.x, this.center.y - 10, 16);
        Canvas.drawText(this.levelCreator, this.center.x, this.center.y - 50, 8);
    }
}