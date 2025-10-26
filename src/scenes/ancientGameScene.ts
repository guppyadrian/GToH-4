import { Assets, Canvas, Scene } from "guppy-lib";
import { AncientPlayer } from "../ancientGame/player";

export class AncientGameScene extends Scene {

    player: AncientPlayer;

    static preload(): Promise<void> {
        const promises = [];

        promises.push(Assets.load('textures/player.png', 'player'));
        
        return Promise.all(promises).then(() => { });
    }

    constructor() {
        super();

        Canvas.changeResolution(300, 300);

        this.player = new AncientPlayer(150, 60);
    }

    update(): void {
        this.player.update();
        
    }

    draw(): void {
        this.player.draw();
    }
}