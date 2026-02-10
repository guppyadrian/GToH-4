import { Assets, Input, Master, Sprite, Vector2 } from "guppy-lib";
import { World } from "./world.js";
import { GameScene, GameState } from "../scenes/gameScene.js";

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
    gravityMult: number;
    godMode: boolean;

    // which way gravity is. Positive means falling down, negative falls up
    get gravityDir() {
        return Math.sign(this.gravityMult);
    }

    set gravityDir(val: number) {
        this.gravityMult = Math.abs(this.gravityMult) * val;
    }

    constructor(x: number, y: number, real = true) {
        super(Assets.get('player'), x, y);

        this.canJump = true;
        this.wallJumpCooldown = 0;
        this.statuses = new Set<string>();
        this.realPlayer = real;
        this.gravityMult = 1;
        this.godMode = false;

        this.vy = -3; // parity with original
    }

    update() {
        if (this.godMode)
            this.flyMovement();
        else
            this.physicsTick();
    }
 
    getMovementVector() {
        return new Vector2(
            +Input.get('right') - +Input.get('left'),
            +Input.get('down') - +Input.get('up')
        );
    }

    checkCollision(firstCheck?: boolean) {
        for (const block of World.data) {
            if (block.colliding(this, firstCheck)) return true;
        }
        return false;
    }

    addStatus(status: string) {
        this.statuses.add(status);
    }

    hasStatus(status: string) {
        return this.statuses.has(status);
    }

    flyMovement() {
        if (!this.realPlayer) return;
        
        const movementVector = this.getMovementVector();

        this.x += movementVector.x * 10;
        this.y += movementVector.y * 10;

        this.vx = 0;
        this.vy = 0;
    }

    physicsTick() {
        const movementVector = this.getMovementVector();

        this.vy += PlayerSettings.gravity * this.gravityMult;

        // slow gravity if too fast
        if (this.vy * this.gravityDir > PlayerSettings.maxFallSpeed) {
            this.vy -= this.gravityMult;
        }

        // this is to trigger effects such as bounce blocks
        this.checkCollision(true);

        this.y += this.vy;

        // Some mud check needs to go here
        this.checkCollision(); 
        // TODO: try removing this checkCollision and see if the mud still behaves the same
        //       I am not sure if checking collision again after y movement will really change that much

        if (this.hasStatus('mud')) {
            this.vy = 0;
        }

        let previouslyTouchedIce = this.hasStatus('icy');

        // slowdown if not moving
        if ((movementVector.x === 0 && !this.hasStatus('icy')) || this.hasStatus('mud')) {
            this.vx -= Math.sign(this.vx);
        }
        if (Math.abs(this.vx) > PlayerSettings.speedHardcap) {
            this.vx = Math.sign(this.vx) * PlayerSettings.speedHardcap;
        }

        // some goofty ahh collision code
        if (this.checkCollision()) {
            if (this.vy * this.gravityMult > 0 || this.hasStatus('mud')) { // if falling
                if (!this.hasStatus('no-jump-regen'))
                    this.canJump = true;

                this.statuses.delete('icy');
                previouslyTouchedIce = false;

                // Go backwards until no longer in floor
                for (let i = 0; i < PlayerSettings.maxFloorHeight; i++) {
                    if (!this.checkCollision()) break;
                    this.y -= this.gravityDir; // TODO: make a var outside the loop instead of calling Math.sign repeatedly?

                    // Stuck in wall, so lets just go down
                    if (i === PlayerSettings.maxFloorHeight - 1) {
                        this.y += PlayerSettings.maxFloorHeight * this.gravityDir;
                        while (this.checkCollision()) {
                            this.y += this.gravityDir;
                        }
                    }
                }

                // TODO: Shake & slam particles

            } else { // if not falling (either swapped while in wall or is hitting ceiling)
                for (let i = 0; i < PlayerSettings.maxHorizontalNudge; i++) { // lets try nudging u to the left
                    if (!this.checkCollision()) break;
                    this.x--;
                    if (i === PlayerSettings.maxHorizontalNudge - 1) this.x += PlayerSettings.maxHorizontalNudge;
                }

                for (let i = 0; i < PlayerSettings.maxHorizontalNudge; i++) { // lets try nudging u to the right
                    if (!this.checkCollision()) break;
                    this.x++;
                    if (i === PlayerSettings.maxHorizontalNudge - 1) this.x -= PlayerSettings.maxHorizontalNudge;
                }

                while (this.checkCollision()) this.y += this.gravityDir; // nudging is not working activate nuclear mode and send u down
            }
            this.vy = 0;
        }

        // If falling, then you are not on the ground which means u can't jump!
        if (this.vy * this.gravityDir > PlayerSettings.coyoteFrames) { // TODO: velocity maybe should be divided by this.gravityMult for this check. Coyote frames should be consistent across different gravity strengths
            this.canJump = false;
        }

        // move left/right
        if (this.wallJumpCooldown === 0) {
            this.vx += movementVector.x;
        } else {
            this.wallJumpCooldown--;
        }

        let speed = PlayerSettings.speed;
        if (this.hasStatus('icy')) speed += 3;
        if (this.hasStatus('mud')) speed -= 3;

        // limit x velocity
        if (Math.abs(this.vx) > speed && this.wallJumpCooldown === 0) { // TODO: allow for temp changing player speed so I don't put this hasStatus ternary in the conditional
            this.vx -= Math.sign(this.vx);
        }

        this.updateXPos(movementVector);

        // particle stuff here

        // jump
        if (movementVector.y === -1) {
            if (this.hasStatus('mud'))
            {
                if (Input.justGet('up'))
                    this.jump();
            } 
            else if (this.canJump)
            {
                this.jump();
            }
        }

        if (this.y > 1000)
        {
            this.nextLevel = GameState.currentLevel;
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

    updateXPos(movementVector: Vector2) {
        // change x
        this.x += this.vx;
        // add collision checking
        for (let i = 0; i < PlayerSettings.maxSlopeHeight; i++) {
            if (!this.checkCollision()) break;

            this.y -= this.gravityDir;
            if (i === PlayerSettings.maxSlopeHeight - 1) {
                this.y += PlayerSettings.maxSlopeHeight * this.gravityDir;
                while(this.checkCollision()) this.x -= Math.sign(this.vx);

                if (movementVector.y === -1 && Math.abs(this.vx) > 2) {
                    if (this.wallJumpCooldown < 3 && !this.hasStatus('no-wj')) { // some njump thing goes here
                        this.vx = Math.round(this.vx * -1.2);
                        this.vy = Math.round(PlayerSettings.jumpStrength / -1.5 * this.gravityDir);
                        this.wallJumpCooldown = 7; // 7 frame cooldown
                    }
                } else {
                    this.vx = 0;
                }
            }
        }
    }

    jump() {
        this.vy = -PlayerSettings.jumpStrength * this.gravityDir;
        this.canJump = false;
    }
}

