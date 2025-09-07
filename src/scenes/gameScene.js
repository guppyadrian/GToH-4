import { Player } from "../game/player";
import { Assets } from "../libs/assets";
import { Scene } from "../libs/scene";

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
    }

    draw() {
        this.player.draw();
    }
}