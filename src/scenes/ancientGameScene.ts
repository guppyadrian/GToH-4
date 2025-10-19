import { Canvas, Scene } from "guppy-lib";

export class AncientGameScene extends Scene {

    player: AncientPlayer;

    static preload(): Promise<void> {
        return Promise.resolve();
    }

    constructor() {
        super();

        Canvas.changeResolution(300, 300);
    }

    update(): void {
        
    }

    draw(): void {
        
    }
}