import { Assets, Camera, Canvas, Input, Master, Scene, Vector2 } from "guppy-lib";
import { Player } from "../game/player.js";
import { World } from "../game/world.js";
import { Levels } from "../game/levels.js";
import { FPSCounter } from "../game/fps.js";

export class GameState {
    static redActive = true;
}

export class GameScene extends Scene {
    player;
    visualPlayer;
    drawfps;
    physicsfps;
    futurePos;

    static preload(): Promise<void> {
        const promises = [];

        

        promises.push(Assets.load('player.png', 'player'));
        promises.push(Assets.load('textures/blocks/metalblock.png', 'metal-block'));
        promises.push(Assets.load('textures/blocks/block.png', 'block'));
        promises.push(Assets.load('textures/blocks/redblock.png', 'red-block'));
        promises.push(Assets.load('textures/blocks/blueblock.png', 'blue-block'));
        promises.push(Assets.load('textures/blocks/orangeblock.png', 'orange-block'));
        promises.push(Assets.load('textures/blocks/purpleblock.png', 'purple-block'));

        return Promise.all(promises).then(() => {});
    }

    constructor() {
        super();

        this.drawfps = new FPSCounter();
        this.physicsfps = new FPSCounter();

        this.player = new Player(0, 0);
        this.visualPlayer = new Player(0, 0);
        this.startLevel(Levels.get(4));
        Canvas.fullscreen();
        
        Camera.z = 2;  //Canvas.width / 700;

        this.futurePos = Vector2.zero;
    }

    startLevel(levelData: any) {
        this.player = new Player(150, 60);
        World.createWorld(levelData);
    }

    update() {
        this.physicsfps.tickStarted();

        // TODO: Check when color swap is done; beofre or after player update?
        if (Input.justGet("swap")) {
            GameState.redActive = !GameState.redActive;
        }

        // TODO: when world updated?
        World.update();

        this.player.update();

        if (Math.abs(this.player.x - this.futurePos.x) > 2)
            console.log("Incorrect extrapolation of X: ", this.futurePos.x - this.player.x);
        if (Math.abs(this.player.y - this.futurePos.y) > 2)
            console.log("Incorrect extrapolation of Y: ", this.futurePos.y - this.player.y);

        // for extrapolation
        this.visualPlayer.x = this.player.x;
        this.visualPlayer.y = this.player.y;
        this.visualPlayer.vx = this.player.vx;
        this.visualPlayer.vy = this.player.vy;
        this.visualPlayer.update();
        this.futurePos = this.visualPlayer.pos;
        

        this.physicsfps.tickEnded();
    }

    draw() {

        Camera.x -= ((Camera.x - this.player.center.x) / 25); // TODO: Rewrite this, I'm sure I could shave some of it down
        Camera.y -= ((Camera.y - this.player.center.y) / 25); // update: nvm its cleaner

        this.drawfps.tickStarted();
        World.draw();

        const interpolation = Master.tickAcc / Master.tickTime;
        this.visualPlayer.pos = lerpVec2(this.player.pos, this.futurePos, interpolation);
        this.visualPlayer.draw();

        this.drawfps.tickEnded();

        // debug
        Canvas.ctx.fillStyle = "black";
        Canvas.ctx.fillText("Physics FPS: " + this.physicsfps.fps.toString(), 20, 10);
        Canvas.ctx.fillText("Physics idle: " + this.physicsfps.idleTime.toString(), 20, 30);
        Canvas.ctx.fillText("Physics tick: " + this.physicsfps.tickTime.toString(), 20, 50);

        Canvas.ctx.fillText("Draw FPS: " + this.drawfps.fps.toString(), 120, 10);
        Canvas.ctx.fillText("Draw idle: " + this.drawfps.idleTime.toString(), 120, 30);
        Canvas.ctx.fillText("Draw tick: " + this.drawfps.tickTime.toString(), 120, 50);

        if (this.physicsfps.tickTime > 1) {
            console.log("WARNING: 2ms for tick time! Something wrong?");
        }

    }
}

/**
 * 
 * @param x start 
 * @param y current
 * @param t interpolation percent. Between 0 and 1
 * @returns interpolated position
 */
function lerp(x: number, y: number, t: number) {
    return x * (1 - t) + y * t;
}

function lerpVec2(pos1: Vector2, pos2: Vector2, t: number) {
    return new Vector2(lerp(pos1.x, pos2.x, t), lerp(pos1.y, pos2.y, t));
}