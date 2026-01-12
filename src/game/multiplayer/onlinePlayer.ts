import { Assets, Sprite } from "guppy-lib";

interface playerFrame
{
    x: number;
    y: number;
}

class OnlinePlayer extends Sprite {
    uuid: string;
    constructor(uuid: string) {
        super(Assets.get('player'), 0, 0);
        this.uuid = uuid;
    }
}

export { OnlinePlayer };