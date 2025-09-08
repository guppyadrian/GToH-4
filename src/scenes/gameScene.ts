import { Assets, Camera, Master, Scene } from "guppy-lib";
import { Player } from "../game/player.js";
import { World } from "../game/world.js";
import data from "../levels/level1.json" assert { type: "json" };

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
        World.createWorld(data);
    }

    update() {
        this.player.update();
        Camera.x = this.player.center.x - Master.width / 2
        Camera.y = this.player.center.y - Master.height / 2; 
    }

    draw() {
        World.draw();
        this.player.draw();
    }
}