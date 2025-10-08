import { Assets, Camera, Canvas, Input, Master, Scene, Vector2 } from "guppy-lib";
import { Player } from "../game/player.js";
import { World } from "../game/world.js";
import { GetLevel, Levels, type LevelData } from "../game/levels.js";
import { FPSCounter } from "../game/fps.js";
import { OptionsScene } from "./optionsScene.js";
import { Options } from "../game/options.js";

export class GameState {
    static redActive = false;
    static currentLevel: number;
    static lobbyLevel: number;
    static lastLevel: number;
}

export class GameScene extends Scene {
    player;
    drawfps;
    physicsfps;

    // linear interpolation
    visualPlayer;
    futurePos;
    lastFrameTime;

    static preload(): Promise<void> {

        const blockAtlas = [
            ['metal-block', 'metalblock.png'],
            ['block', 'block.png'],
            ['red-block', 'redblock.png'],
            ['blue-block', 'blueblock.png'],
            ['orange-block', 'orangeblock.png'],
            ['purple-block', 'purpleblock.png'],
            ['bounce-up', 'bounceUp.png'],
            ['yellow-block', 'yellowblock.png'],
            ['green-portal', 'portalgreen.png'],
        ];

        const promises = blockAtlas.map(([key, path]) => Assets.load('textures/blocks/' + path, key));

        promises.push(Assets.load('textures/player.png', 'player'));

        return Promise.all(promises).then(() => { });
    }

    constructor() {
        super();

        this.drawfps = new FPSCounter();
        this.physicsfps = new FPSCounter();

        this.player = new Player(0, 0);
        this.visualPlayer = new Player(0, 0);
        this.startLevel(0);
        Canvas.fullscreen();
        Canvas.ctx.textAlign = 'center';

        Camera.z = 2;  //Canvas.width / 700;

        this.futurePos = Vector2.zero;

        this.lastFrameTime = 0;
    }

    startLevel(levelID: number) {
        try {
            const lvl = GetLevel(levelID);

            World.createWorld(lvl);

            // Update info on level ids
            if (lvl.type === 'lobby') {
                GameState.lobbyLevel = levelID;
            }
        } 
        catch (error) {
            alert("Tried loading a level that doesn't exist! levelID: " + levelID);
            console.error(error);
        }

        Input.reset();

        // reset player and camera
        this.player = new Player(150, 60); // TODO: make this use spawn pos instead!
        this.visualPlayer = new Player(150, 60);
        Camera.x = this.player.center.x;
        Camera.y = this.player.center.y;
        GameState.redActive = false;
        
        GameState.lastLevel = GameState.currentLevel || 0;
        GameState.currentLevel = levelID;
    }

    update() {
        this.physicsfps.tickStarted();

        // TODO: Check when color swap is done; beofre or after player update?
        if (Input.justGet("swap")) {
            GameState.redActive = !GameState.redActive;
        }

        if (Input.justGet("exit")) {
            if (GameState.currentLevel === GameState.lobbyLevel) {
                this.startLevel(GameState.lastLevel);
            } else {
                this.startLevel(GameState.lobbyLevel);
            }
        }

        if (Input.justGet("options")) {
            Master.changeScene(new OptionsScene());
        }

        // TODO: when world updated?
        World.update();

        this.player.update();

        // for extrapolation
        this.visualPlayer.x = this.player.x;
        this.visualPlayer.y = this.player.y;
        this.visualPlayer.vx = this.player.vx;
        this.visualPlayer.vy = this.player.vy;
        this.visualPlayer.update();
        this.futurePos = this.visualPlayer.pos;

        if (!Options.HighFPS) {
            Camera.x += (this.player.center.x - Camera.x) / 10;
            Camera.y += (this.player.center.y - Camera.y) / 10;
        }

        this.physicsfps.tickEnded();
    }

    draw() {

        const frameTime = performance.now();
        const deltaTime = frameTime - this.lastFrameTime;
        this.lastFrameTime = frameTime;

        const interpolation = Master.tickAcc / Master.tickTime;
        this.visualPlayer.pos = lerpVec2(this.player.pos, this.futurePos, interpolation);


        const followSpeed = 5.5;
        if (Options.HighFPS) {
            Camera.x += (this.visualPlayer.center.x - Camera.x) * (1 - Math.exp(-followSpeed * (deltaTime / 1000)));
            Camera.y += (this.visualPlayer.center.y - Camera.y) * (1 - Math.exp(-followSpeed * (deltaTime / 1000)));
        }

        this.drawfps.tickStarted();

        World.draw();

        if (Options.HighFPS) {
            this.visualPlayer.draw();
        } else {
            this.player.draw();
        }
        

        this.drawfps.tickEnded();

        // debug
        Canvas.setFillStyle('black');
        Canvas.ctx.font = '10px Arial';
        Canvas.ctx.fillText("Physics FPS: " + this.physicsfps.fps.toString(), 40, 10);
        Canvas.ctx.fillText("Physics idle: " + this.physicsfps.idleTime.toString(), 40, 30);
        Canvas.ctx.fillText("Physics tick: " + this.physicsfps.tickTime.toString(), 40, 50);

        Canvas.ctx.fillText("Draw FPS: " + this.drawfps.fps.toString(), 120, 10);
        Canvas.ctx.fillText("Draw idle: " + this.drawfps.idleTime.toString(), 120, 30);
        Canvas.ctx.fillText("Draw tick: " + this.drawfps.tickTime.toString(), 120, 50);

        Canvas.ctx.fillText("Player X: " + this.player.x, 40, 70);
        Canvas.ctx.fillText("Player Y: " + this.player.y, 120, 70);
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