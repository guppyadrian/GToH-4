import { Assets, Button, Master, Mouse, Scene } from "guppy-lib";
import { LoadingScene } from "./loadingScene";
import { GameScene } from "./gameScene";

export class MainMenuScene extends Scene {

    button: Button;

    static preload(): Promise<void> {
        Mouse.initialize();

        return Assets.load("textures/menu/playRemastered.png", 'play-remastered');
    }

    constructor() {
        super();

        this.button = this.addButton(Assets.get("play-remastered"), 0, 0, () => {
            Master.changeScene(new LoadingScene(GameScene));
        });
    }

    update(): void {
        
    }

    draw(): void {
        this.button.draw();
    }
}