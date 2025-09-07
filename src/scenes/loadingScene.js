import { Master, Scene } from "guppy-lib";


// TODO: honestly this should be in libs, for more portability and so master can call this directly

export class LoadingScene extends Scene {
    static preload() {
        super.preload();
    }

    static load(sceneToPreload) {
        return new this(sceneToPreload);
    }

    sceneToPreload;

    constructor(sceneToPreload) {
        super();
        this.sceneToPreload = sceneToPreload;
    }

    draw() {
        Master.ctx.font = '32px Arial';
        Master.ctx.textAlign = 'center';
        Master.ctx.fillText('Loading...', Master.width / 2, Master.height / 2);
    }

    initialize() {
        const time = Date.now();
        this.sceneToPreload.preload().then(() => {
            console.log("Loaded in", Date.now() - time, "ms!");
            Master.changeScene(new this.sceneToPreload());
        });
    }
}