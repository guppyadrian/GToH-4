import { Assets, Camera, Canvas, Input, Master, Scene, Sprite, Vector2 } from "guppy-lib";
import { Player } from "../game/player.js";
import { World } from "../game/world.js";
import { GetLevel, PromptPlayerLevel, type LevelData } from "../game/levels.js";
import { FPSCounter } from "../game/fps.js";
import { OptionsScene } from "./optionsScene.js";
import { Options } from "../game/options.js";
import { Multiplayer } from "../multiplayer.js";
import { inLoginScreen, showLoginScreen } from "../account.js";
import { ChatSystem } from "../game/chat.js";

export class GameState {
    static timer = 0;
    static redActive = false;
    static currentLevel: number;
    static lobbyLevel: number;
    static lastLevel: number;
    static inventory: Record<string, boolean | number> = {};
    static spectating: string | null = null;
    static worldBeforeSpectate: number = -2;

    static resetState() {
        GameState.redActive = false;
        GameState.inventory = {};
        GameState.timer = 0;
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
    cheatsEnabled;

    // linear interpolation
    visualPlayer;
    futurePos;
    lastFrameTime;

    // systems
    chat;

    get canMove() {
        return !this.chat.chatting;
    }

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
        this.cheatsEnabled = false;
        this.lastFrameTime = 0;
        this.chat = new ChatSystem();

        Multiplayer.ready();

        document.addEventListener("visibilitychange", this.onVisibilityChange);
    }

    destroy(): void {
        document.removeEventListener("visibilitychange", this.onVisibilityChange);
        this.chat.destroy();
        super.destroy();
    }

    private onVisibilityChange() {
        if (document.hidden) {
            Multiplayer.socket.emit('toggle-afk', true);
        } else {
            Multiplayer.socket.emit('toggle-afk', false);
        }
    }

    winLevel(nextLevel: number) {
        if (this.cheatsEnabled) {
            Multiplayer.alert('Cheats enabled.');
        } else {
            const levelName = GetLevel(GameState.currentLevel)?.about?.name;
            if (levelName)
                Multiplayer.alert(`${levelName} beaten in ${GameState.timer / 40} seconds`);
            Multiplayer.uploadLevelTime(GameState.currentLevel, GameState.timer);
        }
        this.startLevel(nextLevel);
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
        if (!this.chat.chatting && Input.justGet('login')) showLoginScreen();
        if (inLoginScreen) return; // TODO: will this break stuff?

        if (!this.chat.chatting && Input.justGet('chat')) { // TODO: move to a chat.update() method
            this.chat.startChatting();
        }
        if (Input.justGet('cancel')) {
            this.chat.finishChatting(false);
        }

        this.physicsfps.tickStarted();

        if (GameState.lobbyLevel !== GameState.currentLevel)
            GameState.timer++;

        // TODO: Check when color swap is done; beofre or after player update?
        if (this.canMove && Input.justGet("swap")) {
            GameState.redActive = !GameState.redActive;
        }

        if (this.canMove && Input.justGet("exit")) {
            if (GameState.currentLevel === GameState.lobbyLevel) {
                this.startLevel(GameState.lastLevel);
            } else {
                this.startLevel(GameState.lobbyLevel);
            }
        }

        if (this.canMove && Input.justGet("load-level")) { // TODO: this doesn't exist anymore
            const lvl = PromptPlayerLevel();
            if (lvl) this.startLevel(lvl);
        }

        // TODO: when world updated?
        World.update();

        if (!GameState.spectating)
            this.player.update();

        // for extrapolation
        this.visualPlayer.x = this.player.x;
        this.visualPlayer.y = this.player.y;
        this.visualPlayer.vx = this.player.vx;
        this.visualPlayer.vy = this.player.vy;
        this.visualPlayer.update();
        this.futurePos = this.visualPlayer.pos;

        if (!Options.HighFPS)
            this.updateCamera(this.player, 25);

        if (this.canMove && Input.justGet("options")) {
            Master.changeScene(new OptionsScene());
        }

        if (Multiplayer.started) { // TODO: rn this is sending 40 times a second
            Multiplayer.sendPlayer(this.player);
        }

        this.physicsfps.tickEnded();
    }

    updateCamera(follow: Sprite, deltaTime: number) {
        const followSpeed = 5.5;
        if (Options.SmoothCamera) {
            Camera.x += (follow.center.x - Camera.x) * (1 - Math.exp(-followSpeed * (deltaTime / 1000)));
            Camera.y += (follow.center.y - Camera.y) * (1 - Math.exp(-followSpeed * (deltaTime / 1000)));
        } else {
            Camera.x = follow.center.x;
            Camera.y = follow.center.y;
        }
    }

    draw() {

        const frameTime = performance.now();
        const deltaTime = frameTime - this.lastFrameTime;
        this.lastFrameTime = frameTime;

        const interpolation = Master.tickAcc / Master.tickTime;
        this.visualPlayer.pos = lerpVec2(this.player.pos, this.futurePos, interpolation);

        if (!GameState.spectating) {
            if (Options.HighFPS)
                this.updateCamera(this.visualPlayer, deltaTime);
        } else
            this.spectateUpdate(deltaTime);

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

        // draw the top right playerlist
        if (Input.get('show-chat'))
        { // TODO: move to own func
            const players = Multiplayer.playerList.entries();
            Canvas.ctx.textAlign = 'right';
            let i = 0;
            for (const [_, value] of players) {
                const level = GetLevel(value.level);
                Canvas.ctx.fillText(`${value.afk ? "(AFK) " : ""}${value.username} in ${level?.type === 'lobby' ? level.about?.diff : level?.about?.name}`, Canvas.width - 10, (i++) * 30 + 65);
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
        Canvas.ctx.fillText("Timer: " + GameState.timer / 40, 10, 100);
        Canvas.ctx.fillText("Press O for options", 10, 40);
        if (!Multiplayer.connected) Canvas.setFillStyle('red');
        Canvas.ctx.fillText(Multiplayer.connected ? "Connected to server" : "Disconnected from server!", 10, 15);
        if (!Multiplayer.connected) Canvas.setFillStyle('black');
        Canvas.ctx.textAlign = 'center';
    }

    spectateUpdate(deltaTime: number) {
        this.player.x = 0;
        this.player.y = 100000;
        if (!GameState.spectating) return;
        const spectatedPlayer = Multiplayer.getPlayer(GameState.spectating);
        if (Input.justGet('cancel')) {
            GameState.spectating = null;
            this.startLevel(GameState.worldBeforeSpectate);
            Multiplayer.socket.emit('spectating', spectatedPlayer?.uuid, false);
            return;
        }
        if (!spectatedPlayer || spectatedPlayer.y === 100000) {
            GameState.spectating = null;
            this.startLevel(GameState.worldBeforeSpectate);
            Multiplayer.socket.emit('spectating', spectatedPlayer?.uuid, false);
            return;
        }
        if (spectatedPlayer.level !== GameState.currentLevel) {
            this.startLevel(spectatedPlayer.level);
        }
        this.updateCamera(spectatedPlayer, deltaTime);
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