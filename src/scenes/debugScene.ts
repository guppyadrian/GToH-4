import { Assets, Camera, Canvas, Input, Scene } from "guppy-lib";
import { Block } from "../game/block";

export class DebugScene extends Scene {
    zoom: number = 1;
    block: Block;

    constructor() {
        super();
        Camera.z = 2;
        Camera.x = 20;
        this.block = new Block(15, 15);
    }

    static preload() {
        const promises = [];

        promises.push(Assets.load('textures/blocks/metalblock.png', 'metal-block'));

        return Promise.all(promises).then(() => {});
    }

    update() {
        if (Input.get('right')) {
            this.zoom += 0.01;
        } else if (Input.get('left')) {
            this.zoom -= 0.01;
        }
        Camera.z = this.zoom;

        if (Input.get('down')) {
            Canvas.width += 1;
        } else if (Input.get('up')) {
            Canvas.width -= 1;
        }
    }

    draw() {
        this.block.draw();
    }
}