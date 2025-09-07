import { Assets, Camera, Master, Scene, Sprite } from "guppy-lib";
import { Player } from "../game/player";
import { Block } from "../game/block";

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
    }

    update() {
        this.player.update();
        Camera.x = this.player.center.x - Master.width / 2
        Camera.y = this.player.center.y - Master.height / 2; 
    }

    draw() {
        this.player.draw();
        new Block(20, 200, undefined, 2, 1).draw();
    }
}