import { Assets, Camera, Canvas, Input, Scene } from "guppy-lib";
import { createBlock } from "../game/createBlock";
import type { Block } from "../game/blockModels/block";

export class DebugScene extends Scene {
    zoom: number = 1;
    block: Block; // TODO: Make a block interface in createBLock maybe?

    constructor() {
        super();
        Camera.z = 2;
        Camera.x = 20;
        this.block = createBlock(15, 15, 'block', 1, 1);
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