import { Assets, Camera, Master, Scene, Sprite } from "guppy-lib";
import { Player } from "../game/player";
import { Block } from "../game/block";
import { World } from "../game/world";
import data from "../levels/level1.json" assert { type: "json" };

export class GameScene extends Scene {
    player;

    static preload() {
        const promises = [];

        promises.push(Assets.load('player.png', 'player'));

        return Promise.all(promises);
    }

    constructor() {
        super();
        this.player = new Player();
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