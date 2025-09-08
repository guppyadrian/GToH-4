import { Master, Scene } from "guppy-lib";


// TODO: honestly this should be in libs, for more portability and so master can call this directly

interface SceneConstructor {
  new (): Scene;                // must be constructible into a Scene
  preload(): Promise<void>;     // must have a static preload method
}


export class LoadingScene extends Scene {
    sceneToPreload;

    constructor(sceneToPreload: SceneConstructor) {
        super();
        this.sceneToPreload = sceneToPreload;
    }

    draw() {
        Master.ctx.font = '32px Arial';
        Master.ctx.textAlign = 'center';
        Master.ctx.fillText('Loading...', Master.width / 2, Master.height / 2);
    }

    update() { }

    initialize() {
        const time = Date.now();
        this.sceneToPreload.preload().then(() => {
            console.log("Loaded in", Date.now() - time, "ms!");
            Master.changeScene(new this.sceneToPreload());
        });
    }
}