import { LockedBlock } from "../blockModels/lockedBlock";

export class DoorBlock extends LockedBlock {
    constructor(x: number, y: number, w: number, h: number) {
        super(x, y, w, h, 'key0');
        this.texture = "door0";
        this.type = "door";
    }
}