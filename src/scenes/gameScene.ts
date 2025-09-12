import { Assets, Camera, Canvas, Scene } from "guppy-lib";
import { Player } from "../game/player.js";
import { World } from "../game/world.js";
import { Levels } from "../game/levels.js";
import { FPSCounter } from "../game/fps.js";


export class GameScene extends Scene {
    player;
    fps;

    static preload(): Promise<void> {
        const promises = [];

        

        promises.push(Assets.load('player.png', 'player'));
        promises.push(Assets.load('textures/blocks/metalblock.png', 'metal-block'));
        promises.push(Assets.load('textures/blocks/block.png', 'block'));
        promises.push(Assets.load('textures/blocks/redblock.png', 'red-block'));
        promises.push(Assets.load('textures/blocks/blueblock.png', 'blue-block'));

        return Promise.all(promises).then(() => {});
    }

    constructor() {
        super();

        this.fps = new FPSCounter();

        this.player = new Player(0, 0);
        this.startLevel(Levels.get(1));
        Canvas.fullscreen();
        
        Camera.z = Canvas.width / 700;
    }

    startLevel(levelData: any) {
        this.player = new Player(150, 60);
        World.createWorld(levelData);
    }

    update() {
        this.fps.tickStarted();

        this.player.update();
        // Camera.x = this.player.center.x - Master.width / 2
        // Camera.y = this.player.center.y - Master.height / 2; 
        Camera.x -= Math.round((Camera.x - this.player.center.x) / 10); // TODO: Rewrite this, I'm sure I could shave some of it down
        Camera.y -= Math.round((Camera.y - this.player.center.y) / 10);
    }

    draw() {
        World.draw();
        this.player.draw();
        this.fps.tickEnded();

        // debug
        Canvas.ctx.fillText("FPS: " + this.fps.fps.toString(), 20, 10);
        Canvas.ctx.fillText("idle: " + this.fps.idleTime.toString(), 20, 30);
        Canvas.ctx.fillText("tick: " + this.fps.tickTime.toString(), 20, 50);
    }
}