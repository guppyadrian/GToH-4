import { Assets, Camera, Master, Scene, Sprite } from "guppy-lib";
import { Player } from "../game/player";

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
        Sprite.from('player', 20, 200).draw();
    }
}