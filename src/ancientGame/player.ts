import { Area, Assets, Input, Sprite, Vector2 } from "guppy-lib";

const PlayerSettings = {
    speed: 5,
    jumpStrength: 15
};

export class AncientPlayer extends Sprite {
    canJump;
    wallJump
    constructor(x: number, y: number) {
        super(Assets.get('player'), x, y);

        this.canJump = false;
        this.wallJump = 0;
    }

    isTouch() {
        return false;
    }

    update() {
        if (!Input.get('left') && !Input.get('right')) {
            if (this.vx > 0) this.vx--;
            else if (this.vx < 0) this.vx++;
        }

        // gravity

        this.vy += 1;
        if (this.vy > 18) this.vy = 18;
        this.y += this.vy;

        if (this.isTouch()) {
            if (this.vy > 0) {
                this.canJump = true;
                for (let i = 0; i < 20; i++) {
                    if (this.isTouch()) {
                        this.y -= 1;
                    } else break;

                    if (i === 19) {
                        this.y += 18;
                        while (this.isTouch()) {
                            this.y++;
                        }
                    }
                }
                
            } else {
                while (this.isTouch()) this.y++;
            }

            this.vy = 0;
        }

        if (this.vy > 3) this.canJump = false;

        if (this.wallJump === 0) {
            if (Input.get('left')) this.vx -= 1;
            if (Input.get('right')) this.vx += 1;
        } else {
            this.wallJump--;
        }

        if (this.vx > PlayerSettings.speed) this.vx = PlayerSettings.speed;
        if (this.vx < -PlayerSettings.speed) this.vx = -PlayerSettings.speed;

        this.x += this.vx;
        let breakout = false;
        for (let i = 0; i < 15; i++) {
            if (!this.isTouch()) {
                breakout = true;
                break;
            }
            this.y -= 1;
        }
        if (!breakout) {
            this.x -= this.vx;
            this.y += 15;
            if (Input.get('up') && Math.abs(this.vx) > 2) {
                if (this.wallJump === 0) {
                    this.vx *= -1.2;
                    this.vy /= 1.5;
                    this.wallJump = 7;
                }
            } else this.vx = 0;
        }

        // jump
        if (Input.get('up') && this.canJump) {
            this.vy = -PlayerSettings.jumpStrength;
            this.canJump = false;
        }

        // fencing

        // extra
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.vx = Math.round(this.vx);
        this.vy = Math.round(this.vy);
    }
}