import { GameState } from "../../scenes/gameScene";
import { StatusBlock } from "../blockModels/statusBlock";
import type { Player } from "../player";

export class DeathBlock extends StatusBlock {
    constructor(x: number, y: number, w: number, h: number) {
        super(x, y, w, h, 'portal');
        this.texture = "death-block";
        this.type = "die";
    }

    colliding(otherArea: Player): boolean {
        if (!super.colliding(otherArea)) return false;

        otherArea.nextLevel = GameState.currentLevel;

        return false;
    }
}