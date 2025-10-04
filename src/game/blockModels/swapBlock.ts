import { Canvas, type Area } from "guppy-lib";
import { Block } from "./block";
import { GameState } from "../../scenes/gameScene";

export abstract class SwapBlock extends Block {
    active: boolean;
    inverted: boolean;

    constructor(x: number, y: number, w: number, h: number, inverted: boolean) {
        super(x, y, w, h);
        this.type = "swapBlock";
        this.texture = "error";
        this.inverted = inverted;
        this.active = !inverted;
    }

    draw() {
        if (!this.active)
            Canvas.setAlpha(0.3);

        super.draw();

        if (!this.active)
            Canvas.setAlpha(1);
    }

    update() {
        if (this.inverted) {
            this.active = GameState.redActive;
        } else {
            this.active = !GameState.redActive;
        }
    }

    colliding(otherArea: Area): boolean {
        if (!this.active) return false;

        return super.colliding(otherArea);
    }
}