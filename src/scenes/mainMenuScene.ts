import { Assets, Button, Canvas, Master, Mouse, Scene } from "guppy-lib";
import { LoadingScene } from "./loadingScene";
import { GameScene } from "./gameScene";
import { AncientGameScene } from "./ancientGameScene";

export class MainMenuScene extends Scene {

    remasteredButton: Button;
    ancientButton: Button;

    static preload(): Promise<void> {
        const promises = [];

        Mouse.initialize();

        promises.push(Assets.load("textures/menu/playRemastered.png", 'play-remastered'));
        promises.push(Assets.load("textures/menu/playAncient.png", 'play-ancient'));

        return Promise.all(promises).then(() => { });
    }

    constructor() {
        super();

        Canvas.fullscreen();

        this.remasteredButton = this.addButton(Assets.get("play-remastered"), -450, -100, () => {
            Master.changeScene(new LoadingScene(GameScene));
        });

        this.ancientButton = this.addButton(Assets.get("play-ancient"), 150, -100, () => {
            Master.changeScene(new LoadingScene(AncientGameScene));
        });
    }

    update(): void {
        
    }

    draw(): void {
        this.remasteredButton.draw();
        this.ancientButton.draw();
    }
}