import { TimedBlock } from "../blockModels/timedBlock";

export class PurpleBlock extends TimedBlock{
    constructor(x: number, y: number, w: number, h: number) {
        super(x, y, w, h, true);

        this.type = 'purple';
        this.texture = 'purple-block';
    }
}