import { io } from "socket.io-client";
import { GameScene } from "./scenes/gameScene";
import { LoadingScene } from "./scenes/loadingScene.js";
import { Input, Master } from "guppy-lib";

io('http://localhost:3000', {
    reconnectionAttempts: 2
});

// set up keyboard
Input.initialize();
Input.addBind('right', ['KeyD', 'ArrowRight']);
Input.addBind('left', ['KeyA', 'ArrowLeft']);
Input.addBind('up', ['KeyW', 'ArrowUp']);
Input.addBind('down', ['KeyS', 'ArrowDown']);

// Set up MASTER
Master.initialize(document.getElementById("game-canvas") as HTMLCanvasElement);

// OK RUN NOW
Master.changeScene(new LoadingScene(GameScene));

setInterval(Master.tick, 25);