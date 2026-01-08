import { TimedBlock } from "../blockModels/timedBlock";

export class OrangeBlock extends TimedBlock {
    constructor(x: number, y: number, w: number, h: number) {
        super(x, y, w, h, true);

        this.type = 'orange';
        this.texture = 'orange-block';
    }
}