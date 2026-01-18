import { Assets, Sprite } from "guppy-lib";
import { GameState } from "../../scenes/gameScene";

class OnlinePlayer extends Sprite {
    uuid: string;
    level: number;
    constructor(uuid: string) {
        super(Assets.get('player'), 0, 0);
        this.uuid = uuid;
        this.level = -2;
    }

    draw(): void {
        if (GameState.currentLevel !== this.level) return;

        super.draw();
    }
}

export { OnlinePlayer };