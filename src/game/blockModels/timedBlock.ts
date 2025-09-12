import { SwapBlock } from "./swapBlock";

export abstract class TimedBlock extends SwapBlock {
    inc: number;

    constructor(x: number, y: number, w: number, h: number, inverted: boolean) {
        super(x, y, w, h, inverted);

        this.inc = 0;
    }

    update() {
        super.update();
        this.inc++; 
        if (this.inc === 40) { // TODO: FPS?
            this.active = !this.active;
            this.inc = 0;
        }
    }
}