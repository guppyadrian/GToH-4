import { Camera, Canvas, Input, Master, Scene } from "guppy-lib";
import { LoadingScene } from "./loadingScene";
import { GameScene } from "./gameScene";
import { Options } from "../game/options";

export class OptionsScene extends Scene {

    static preload() {
        return Promise.resolve();
    }

    constructor() {
        super();

        Camera.x = 0;
        Camera.y = 0;
        Camera.z = 2;

        Input.reset();
    }

    update() {
        if (Input.justGet("options")) {
            Master.changeScene(new LoadingScene(GameScene));
        }
        if (Input.justGet("left")) {
            Options.HighFPS = !Options.HighFPS;

            if (Options.HighFPS) {
                //Master.drawTime = undefined;
            } else {
                //Master.drawTime = 1000 / 40; // 40fps
            }
        }
    }

    draw() {
        Canvas.drawText("Press O to go back to game", 0, -50);
        Canvas.drawText("Press A to toggle high fps: " + (Options.HighFPS ? "Enabled" : "Disabled"), 0, -20);
    }
}