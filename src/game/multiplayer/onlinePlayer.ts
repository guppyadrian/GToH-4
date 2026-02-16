import { Assets, Canvas, Sprite } from "guppy-lib";
import { GameState } from "../../scenes/gameScene";

class OnlinePlayer extends Sprite {
    uuid: string;
    level: number;
    username: string;
    afk = false;
    constructor(uuid: string, username: string) {
        super(Assets.get('player'), 0, 0);
        this.uuid = uuid;
        this.level = -2;
        this.username = username;
    }

    draw(): void {
        if (GameState.currentLevel !== this.level) return;

        Canvas.drawText(this.username, this.center.x, this.center.y - 20, 12);
        super.draw();
    }
}

export { OnlinePlayer };