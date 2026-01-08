import { StatusBlock } from "../blockModels/statusBlock";

export class IceBlock extends StatusBlock {
    constructor(x: number, y: number, w: number, h: number) {
        super(x, y, w, h, 'icy');
        this.texture = "ice";
        this.type = "ice";
    }
}