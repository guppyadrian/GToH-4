import { Block } from "../blockModels/block";

export class NormalBlock extends Block {
    constructor(x: number, y: number, w: number, h: number) {
        super(x, y, w, h);
        this.type = 'block';
    }
}