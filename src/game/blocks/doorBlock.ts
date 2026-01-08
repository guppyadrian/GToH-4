import { LockedBlock } from "../blockModels/lockedBlock";

export class DoorBlock extends LockedBlock {
    constructor(x: number, y: number, w: number, h: number, tags: string[]) {
        super(x, y, w, h, "key" + tags[0][4]); // TODO: so scuffed... I hate dealing with old level formats
        this.texture = tags[0];
        this.type = "door";
    }
}