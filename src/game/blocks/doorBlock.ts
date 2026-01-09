import { LockedBlock } from "../blockModels/lockedBlock";
import { World } from "../world";

export class DoorBlock extends LockedBlock {
    constructor(x: number, y: number, w: number, h: number, tags: (number | string)[]) {
        const doorID: string = (World.format === 1) ? (tags[0] as string)[4] : tags[0].toString();
        super(x, y, w, h, "key" + doorID); // TODO: so scuffed... I hate dealing with old level formats
        this.texture = "door" + doorID;
        this.type = "door";
    }
}