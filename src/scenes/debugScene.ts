import { Assets, Camera, Canvas, Input, Scene } from "guppy-lib";
import { createBlock } from "../game/createBlock";
import type { Block } from "../game/blockModels/block";
import { FPSCounter } from "../game/fps";

export class DebugScene extends Scene {
    zoom: number = 1;
    block: Block; // TODO: Make a block interface in createBLock maybe?

    fps;

    constructor() {
        super();
        Camera.z = 2;
        Camera.x = 20;
        this.block = createBlock(15, 15, 'block', 1, 1);

        this.fps = new FPSCounter();
    }

    static preload() {
        const promises = [];

        promises.push(Assets.load('textures/blocks/metalblock.png', 'block'));

        return Promise.all(promises).then(() => {});
    }

    update() {
        
    }

    draw() {
        this.block.x = 10000
        this.fps.tickStarted()
        for (let i = 0; i < 100000; i++) {
            this.block.draw();
        }
        this.fps.tickEnded()

        Canvas.ctx.fillText(`tick: ${this.fps.tickTime}`, 50, 50);
    }
}