import { Assets, Input, Master, Sprite, Vector2 } from "guppy-lib";
import { World } from "./world.js";
import { GameState, type GameScene } from "../scenes/gameScene.js";

const PlayerSettings = {
    speed: 5, // highest target speed (without speed modifiers)
    gravity: 1,
    jumpStrength: 15,
    maxFallSpeed: 18,
    speedHardcap: 30,
    maxSlopeHeight: 14, // max height the player will step up when moving horizontally
    coyoteFrames: 3,
    maxHorizontalNudge: 3, // if barely in block or jumping onto ceiling
    maxFloorHeight: 19, // if vertically colliding, will try and move the player up, up to this, then gives up and moves down until not colliding
}

export class Player extends Sprite {
    canJump;
    wallJumpCooldown;
    statuses;
    nextLevel: number | undefined; // where to go next frame
    realPlayer: boolean; // whether or not player is the actual one. Controls changing lvls and stuff

    constructor(x: number, y: number, real = true) {
        super(Assets.get('player'), x, y);

        this.canJump = true;
        this.wallJumpCooldown = 0;
        this.statuses = new Set<string>();
        this.realPlayer = real;

        this.vy = -3; // parity with original
    }

    update() {
        this.physicsTick();
    }
 
    getMovementVector() {
        return new Vector2(
            +Input.get('right') - +Input.get('left'),
            +Input.get('down') - +Input.get('up')
        );
    }

    colliding() {
        for (const block of World.data) {
            if (block.colliding(this)) return true;
        }
        return false;
    }

    addStatus(status: string) {
        this.statuses.add(status);
    }

    hasStatus(status: string) {
        return this.statuses.has(status);
    }

    physicsTick() {
        const movementVector = this.getMovementVector();

        this.vy += PlayerSettings.gravity;

        // slow gravity if too fast
        if (this.vy > PlayerSettings.maxFallSpeed) {
            this.vy--;
        }

        // TODO: Bounce block stuff happens here i think
        this.colliding();

        this.y += this.vy;

        // Some mud check

        let previouslyTouchedIce = this.hasStatus('icy');

        // slowdown if not moving
        if (movementVector.x === 0 && !this.hasStatus('icy')) {
            this.vx -= Math.sign(this.vx);
        }
        if (Math.abs(this.vx) > PlayerSettings.speedHardcap) {
            this.vx = Math.sign(this.vx) * PlayerSettings.speedHardcap;
        }

        // Debug code, remove pls
        if (this.y > Master.height) {
            this.y = Master.height;
            this.vy = 0;
            this.canJump = true;
        }

        // some goofty ahh collision code
        if (this.colliding()) {
            if (this.vy > 0) { // if falling
                // TODO: whatever rjump is it goes here
                this.canJump = true;

                this.statuses.delete('icy');
                previouslyTouchedIce = false;

                // Go backwards until no longer in floor
                for (let i = 0; i < PlayerSettings.maxFloorHeight; i++) {
                    if (!this.colliding()) break;
                    this.y -= 1;

                    // Stuck in wall, so lets just go down
                    if (i === PlayerSettings.maxFloorHeight - 1) {
                        this.y += PlayerSettings.maxFloorHeight;
                        while (this.colliding()) {
                            this.y++;
                        }
                    }
                }

                // TODO: Shake & slam particles

            } else { // if not falling (either swapped while in wall or is hitting ceiling)
                for (let i = 0; i < PlayerSettings.maxHorizontalNudge; i++) { // lets try nudging u to the left
                    if (!this.colliding()) break;
                    this.x--;
                    if (i === PlayerSettings.maxHorizontalNudge - 1) this.x += PlayerSettings.maxHorizontalNudge;
                }

                for (let i = 0; i < PlayerSettings.maxHorizontalNudge; i++) { // lets try nudging u to the right
                    if (!this.colliding()) break;
                    this.x++;
                    if (i === PlayerSettings.maxHorizontalNudge - 1) this.x -= PlayerSettings.maxHorizontalNudge;
                }

                while (this.colliding()) this.y++; // nudging is not working activate nuclear mode and send u down
            }
            this.vy = 0;
        }

        // If falling, then you are not on the ground which means u can't jump!
        if (this.vy > PlayerSettings.coyoteFrames) {
            this.canJump = false;
        }

        // move left/right
        if (this.wallJumpCooldown === 0) {
            this.vx += movementVector.x;
        } else {
            this.wallJumpCooldown--;
        }

        // limit x velocity
        if (Math.abs(this.vx) > PlayerSettings.speed + (this.hasStatus('icy') ? 3 : 0) && this.wallJumpCooldown === 0) { // TODO: allow for temp changing player speed so I don't put this hasStatus ternary in the conditional
            this.vx -= Math.sign(this.vx);
        }

        // change x
        this.x += this.vx;
        // add collision checking
        for (let i = 0; i < PlayerSettings.maxSlopeHeight; i++) {
            if (!this.colliding()) break;

            this.y--;
            if (i === PlayerSettings.maxSlopeHeight - 1) {
                this.y += PlayerSettings.maxSlopeHeight;
                while(this.colliding()) this.x -= Math.sign(this.vx);

                if (movementVector.y === -1 && Math.abs(this.vx) > 2) {
                    if (this.wallJumpCooldown < 3 && !this.hasStatus('no-wj')) { // some njump thing goes here
                        this.vx = Math.round(this.vx * -1.2);
                        this.vy = Math.round(PlayerSettings.jumpStrength / -1.5);
                        this.wallJumpCooldown = 7; // 7 frame cooldown
                    }
                } else {
                    this.vx = 0;
                }
            }
        }

        // particle stuff here

        // jump
        if (movementVector.y === -1 && this.canJump) {
            this.vy = -PlayerSettings.jumpStrength;
            this.canJump = false;
        }

        // New level stuff
        if (this.realPlayer && this.nextLevel !== undefined) {
            (Master.currentScene as GameScene).startLevel(this.nextLevel);   // TODO: FIX THIS NOW!!! it looks ugly
            this.nextLevel = undefined; // TODO: If I don't have this line it breaks. But that shouldn't be the case!
        }
        if (this.realPlayer && this.hasStatus('win')) {
            // trying this instead so you can see yourself in the win for 1 frame like original game
            this.nextLevel = GameState.lobbyLevel;

            // (Master.currentScene as GameScene).startLevel(GameState.lobbyLevel);
        } 

        // TODO: If fall out of world, reset

        if (this.hasStatus('icy'))
            previouslyTouchedIce = true;

        // clear statuses
        this.statuses.clear();

        if (previouslyTouchedIce)
            this.statuses.add('icy');
    }
}