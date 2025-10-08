import { Canvas, Scene } from "guppy-lib";

class OptionsScene extends Scene {

    static preload() {
        return Promise.resolve();
    }

    constructor() {
        super();
    }

    update() {

    }

    draw() {
        Canvas.drawText("Press O to go back to game", 100, 50);
        Canvas.drawText("Press L to toggle high fps", 100, 80);
    }
}