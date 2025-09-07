import { Assets } from "../libs/assets";
import { Input } from "../libs/input";
import { Sprite } from "../libs/sprite";

const PlayerSettings = {
    speed: 5,
}

export class Player extends Sprite {
    constructor(x, y) {
        super(Assets.get('player'));
    }

    update() {
        this.handleMovement();
        super.update();
    }
 
    handleMovement() {
        this.x += (Input.get('right') - Input.get('left')) * PlayerSettings.speed;
        this.y += (Input.get('down') - Input.get('up')) * PlayerSettings.speed;
    }
}