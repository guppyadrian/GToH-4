import { StatusBlock } from "../blockModels/statusBlock";

export class NoJumpBlock extends StatusBlock {
    constructor(x: number, y: number, w: number, h: number) {
        super(x, y, w, h, 'no-jump-regen');
        this.texture = "no-jump-block";
        this.type = "rjump";
    }
}