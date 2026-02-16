import { Assets, Camera, Canvas, Input, Master, Scene, Vector2 } from "guppy-lib";
import { Player } from "../game/player.js";
import { World } from "../game/world.js";
import { GetLevel, Levels, PromptPlayerLevel, type LevelData } from "../game/levels.js";
import { FPSCounter } from "../game/fps.js";
import { OptionsScene } from "./optionsScene.js";
import { Options } from "../game/options.js";
import { Multiplayer } from "../multiplayer.js";
import { inLoginScreen, showLoginScreen } from "../account.js";
import { runCommand } from "../game/commands.js";
import { ChatSystem } from "../game/chat.js";

export class GameState {
    static redActive = false;
    static currentLevel: number;
    static lobbyLevel: number;
    static lastLevel: number;
    static inventory: Record<string, boolean | number> = {};

    static resetState() {
        GameState.redActive = false;
        GameState.inventory = {};
    }

    static changeLevel(newLvlID: number) {
        this.resetState();
        GameState.lastLevel = GameState.currentLevel || 0;
        GameState.currentLevel = newLvlID;
    }
}

export class GameScene extends Scene {
    player;
    drawfps;
    physicsfps;

    // linear interpolation
    visualPlayer;
    futurePos;
    lastFrameTime;

    // systems
    chat;

    static preload(): Promise<void> {

        const blockAtlas = [ // TODO: for some reason i can't check if the textures fail to load. check assets.ts for more info but the onerror just isn't firing!
            ['metal-block', 'metalblock.png'],
            ['block', 'block.png'],
            ['red-block', 'redblock.png'],
            ['blue-block', 'blueblock.png'],
            ['orange-block', 'orangeblock.png'],
            ['purple-block', 'purpleblock.png'],
            ['bounce-up', 'bounceUp.png'],
            ['bounce-down', 'bounceDown.png'],
            ['bounce-left', 'bounceLeft.png'],
            ['bounce-right', 'bounceRight.png'],
            ['yellow-block', 'yellowblock.png'],
            ['green-portal', 'portalgreen.png'],
            ['ice', 'iceblock.png'],
            ['vine', 'vines.png'],
            ['mud-block', 'mudblock.png'],
            ['no-jump-block', 'nojumpblock.png'],
            ['small-block', 'smallblock.png'],
            ['death-block', 'skullblock.png'],
            ['reverse-gravity-block', 'rgravblock.png'],
            ['normal-gravity-block', 'ngravblock.png'],
        ];

        for (let i = 0; i < 10; i++) // adding all 10 doors/keys in with code cause im lazy!!!
        {
            blockAtlas.push([`door${i}`, `doors/door${i}.png`]);
            blockAtlas.push([`key${i}`, `keys/key${i}.png`]);
        }

        const promises = blockAtlas.map(([key, path]) => Assets.load('textures/blocks/' + path, key));

        promises.push(Assets.load('textures/player.png', 'player'));

        Canvas.font = "MinecraftRegular";

        return Promise.all(promises).then(() => { }, () => {alert("failed to preload game! Maybe a texture is missing?")});
    }

    constructor() {
        super();

        this.drawfps = new FPSCounter();
        this.physicsfps = new FPSCounter();

        this.player = new Player(0, 0);
        this.visualPlayer = new Player(0, 0, false);
        this.startLevel(-2);
        Canvas.fullscreen();
        Canvas.ctx.textAlign = 'center';

        Camera.z = 2;  //Canvas.width / 700;

        this.futurePos = Vector2.zero;

        this.lastFrameTime = 0;

        this.chat = new ChatSystem();

        Multiplayer.ready();
    }

    startLevel(levelData: Array<any>[]): void;
    startLevel(levelData: LevelData): void;
    startLevel(levelID: number): void;
    startLevel(level: number | LevelData | Array<any>[]) {
        let levelID = 0;
        let lvl: LevelData;
        try {
            if (typeof level === 'number') {
                lvl = GetLevel(level)!;
                levelID = level;
            } else if (Array.isArray(level)) {
                lvl = {
                    id: 0,
                    format: 1,
                    data: level
                };
            } else {
                lvl = level;
            }
            
            World.createWorld(lvl);

            // Update info on level ids
            if (lvl.type === 'lobby') {
                GameState.lobbyLevel = levelID;
            }

            this.player = new Player(lvl.spawn?.[0] ?? 150, lvl.spawn?.[1] ?? 60);
            this.visualPlayer = new Player(150, 60, false);
        } 
        catch (error) {
            if (typeof level === 'number')
                alert("Failed loading level! levelID: " + level + ". Maybe it doesn't exist?");
            else 
                alert ("Failed loading custom level");
            console.error(error);
        }

        
        Input.reset();

        // reset camera
        Camera.x = this.player.center.x;
        Camera.y = this.player.center.y;
        
        GameState.changeLevel(levelID);
    }

    update() {
        if (Input.justGet('login')) showLoginScreen();
        if (inLoginScreen) return; // TODO: will this break stuff?

        if (Input.justGet('chat')) {
            const p = prompt("enter message or command");
            if (p != null && p != '') {
                if (p[0] === '/') runCommand(p.substring(1, p.length));
                else this.chat.sendMessage(p);
            } 
        }

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

        if (Input.justGet("load-level")) { // TODO: this doesn't exist anymore
            const lvl = PromptPlayerLevel();
            if (lvl) this.startLevel(lvl);
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
            if (Options.SmoothCamera) {
                Camera.x += (this.player.center.x - Camera.x) / 10;
                Camera.y += (this.player.center.y - Camera.y) / 10;
            } else {
                Camera.x = this.player.center.x;
                Camera.y = this.player.center.y;
            }
        }

        if (Input.justGet("options")) {
            Master.changeScene(new OptionsScene());
        }

        if (Multiplayer.started) { // TODO: rn this is sending 40 times a second
            Multiplayer.sendPlayer(this.player);
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
            if (Options.SmoothCamera) {
                Camera.x += (this.visualPlayer.center.x - Camera.x) * (1 - Math.exp(-followSpeed * (deltaTime / 1000)));
                Camera.y += (this.visualPlayer.center.y - Camera.y) * (1 - Math.exp(-followSpeed * (deltaTime / 1000)));
            } else {
                Camera.x = this.visualPlayer.center.x;
                Camera.y = this.visualPlayer.center.y;
            }
        }

        this.drawfps.tickStarted();

        World.draw();

        if (Options.HighFPS) {
            this.visualPlayer.draw();
        } else {
            this.player.draw();
        }

        // Draw other players
        if (Multiplayer.started) {
            Multiplayer.playerList.forEach(player => {
                player.draw();
            });
        }
        
        this.chat.draw();

        if (Input.get('show-chat'))
        { // TODO: move to own func
            const players = Multiplayer.playerList.entries();
            Canvas.ctx.textAlign = 'right';
            let i = 0;
            for (const [_, value] of players) {
                const level = GetLevel(value.level);
                Canvas.ctx.fillText(`${value.username} in ${level?.type === 'lobby' ? level.about?.diff : level?.about?.name}`, Canvas.width - 10, (i++) * 25 + 60);
            }
            const level = GetLevel(GameState.currentLevel);
            Canvas.ctx.fillText(`${Multiplayer.username} in ${level?.type === 'lobby' ? level.about?.diff : level?.about?.name}`, Canvas.width - 10, 35);
        }

        this.drawfps.tickEnded();

        // debug
        Canvas.setFillStyle('black');
        // Canvas.ctx.font = '10px Arial';
        // Canvas.ctx.fillText("Physics FPS: " + this.physicsfps.fps.toString(), 40, 10);
        // Canvas.ctx.fillText("Physics idle: " + this.physicsfps.idleTime.toString(), 40, 30);
        // Canvas.ctx.fillText("Physics tick: " + this.physicsfps.tickTime.toString(), 40, 50);

        // Canvas.ctx.fillText("Draw FPS: " + this.drawfps.fps.toString(), 120, 10);
        // Canvas.ctx.fillText("Draw idle: " + this.drawfps.idleTime.toString(), 120, 30);
        // Canvas.ctx.fillText("Draw tick: " + this.drawfps.tickTime.toString(), 120, 50);

        Canvas.ctx.font = '20px Arial';
        Canvas.ctx.textAlign = 'left';
        Canvas.ctx.fillText("X: " + this.player.x, 10, 70);
        Canvas.ctx.fillText("Y: " + this.player.y, 100, 70);
        Canvas.ctx.fillText("Press O for options", 10, 40);
        if (!Multiplayer.connected) Canvas.setFillStyle('red');
        Canvas.ctx.fillText(Multiplayer.connected ? "Connected to server" : "Disconnected from server!", 10, 15);
        if (!Multiplayer.connected) Canvas.setFillStyle('black');
        Canvas.ctx.textAlign = 'center';
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