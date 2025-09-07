// So thi

import { Camera } from "./camera";
import { Vector2 } from "./vector2";

export class Master {
    static initialized = false;
    static currentScene;
    static canvas;
    static ctx;

    // TODO: make error checking for these stuff
    static get width() {
        return this.canvas.width; // TODO: make sure this is still accurate with zoom (probably not???)
    }
    static get height() {
        return this.canvas.height;
    }

    static initialize(canvas) {
        if (Master.initialized) return;
        Master.initialized = true;

        Master.canvas = canvas;
        Master.ctx = canvas.getContext('2d');
    }

    static changeScene(newScene) {
        if (Master.currentScene) {
            Master.currentScene.destroy();
        }
        Master.currentScene = newScene;
        newScene.initialize();
    }

    // TODO: this conflicts with a draw loop for Master. like the name does. I would like master to have draw() and update() loops, but I have to directly call currentScene.draw()
    static draw(image, x, y) {
        const drawPos = Camera.toScreen(x, y);
        Master.ctx.drawImage(image, drawPos.x, drawPos.y);
    }

    static update() {
        Master.currentScene.update();
    }

    // a combined update/draw
    static tick() {
        Master.update();
        Master.ctx.clearRect(0, 0, Master.width, Master.height);
        Master.currentScene.draw();
    }
}