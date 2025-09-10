import { Assets, Camera, Master, Scene } from "guppy-lib";
import { Player } from "../game/player.js";
import { World } from "../game/world.js";
import { Levels } from "../game/levels.js";

export class GameScene extends Scene {
    player;

    static preload(): Promise<void> {
        const promises = [];

        promises.push(Assets.load('player.png', 'player'));

        return Promise.all(promises).then(() => {});
    }

    constructor() {
        super();
        this.player = new Player(0, 0);
        this.startLevel(Levels.get(1));
    }

    startLevel(levelData: any) {
        this.player = new Player(150, 60);
        World.createWorld(levelData);
    }

    update() {
        this.player.update();
        // Camera.x = this.player.center.x - Master.width / 2
        // Camera.y = this.player.center.y - Master.height / 2; 
        Camera.x -= Math.round((Camera.x - (this.player.center.x - Master.width / 2)) / 10 * Master.width) / Master.width; // TODO: Rewrite this, I'm sure I could shave some of it down
        Camera.y -= Math.round((Camera.y - (this.player.center.y - Master.height / 2)) / 10 * Master.height) / Master.height;
    }

    draw() {
        World.draw();
        this.player.draw();
    }
}