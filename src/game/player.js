import { Assets, Input, Master, Sprite, Vector2 } from "guppy-lib";
import { World } from "./world";

const PlayerSettings = {
    speed: 5, // highest target speed (without speed modifiers)
    gravity: 1,
    jumpStrength: 15,
    maxFallSpeed: 18,
    speedHardcap: 30,
    maxSlopeHeight: 14, // max height the player will step up when moving horizontally
    coyoteFrames: 3,
    maxFloorHeight: 19, // if vertically colliding, will try and move the player up, up to this, then gives up and moves down until not colliding
}

export class Player extends Sprite {
    // not defining stuff here, look at constructor

    constructor(x, y) {
        super(Assets.get('player'));

        this.canJump = false;
        this.wallJumpCooldown = 0;
    }

    update() {
        this.physicsTick();
    }
 
    getMovementVector() {
        const vec = new Vector2();
        vec.x = (Input.get('right') - Input.get('left'));
        vec.y = (Input.get('down') - Input.get('up'));
        return vec;
    }

    colliding() {
        for (const block of World.data) {
            if (super.colliding(block)) return true;
        }
        return false;
    }

    physicsTick() {
        const movementVector = this.getMovementVector();

        this.vy += PlayerSettings.gravity;

        // slow gravity if too fast
        if (this.vy > PlayerSettings.maxFallSpeed) {
            this.vy--;
        }

        // TODO: Bounce block stuff happens here i think

        this.y += this.vy;

        // Some mud check

        // slowdown if not moving
        if (movementVector.x === 0) {
            this.vx -= Math.sign(this.vx);
        }
        if (Math.abs(this.vx) > PlayerSettings.speedHardcap) { // TODO: Don't make these magic numbers!
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

                // Go backwards until no longer in floor
                for (let i = 0; i < 19; i++) {
                    if (!this.colliding()) break;
                    this.y -= 1;

                    // Stuck in wall, so lets just go down
                    if (i === 18) {
                        this.y += 19;
                        while (this.colliding()) {
                            this.y++;
                        }
                    }
                }

                // TODO: Shake & slam particles

            } else { // if not falling (either swapped while in wall or is hitting ceiling)
                for (let i = 0; i < 3; i++) { // lets try nudging u to the left
                    if (!this.colliding()) break;
                    this.x--;
                    if (i === 2) this.x += 3;
                }

                for (let i = 0; i < 3; i++) { // lets try nudging u to the right
                    if (!this.colliding()) break;
                    this.x++;
                    if (i === 2) this.x -= 3;
                }

                while (this.colliding()) this.y++; // nudging is not working activate nuclear mode and send u down
            }
            this.vy = 0;
        }

        // If falling, then you are not on the ground which means u can't jump!
        if (this.vy > 3) {
            this.canJump = false;
        }

        // move left/right
        if (this.wallJumpCooldown === 0) {
            this.vx += movementVector.x;
        } else {
            this.wallJumpCooldown--;
        }

        // limit x velocity
        if (Math.abs(this.vx) > PlayerSettings.speed && this.wallJumpCooldown === 0) {
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
                    if (this.wallJumpCooldown < 3) { // some njump thing goes here
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

        // If fall out of world, reset

    }
}