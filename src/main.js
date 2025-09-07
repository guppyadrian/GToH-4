import { io } from "socket.io-client";
import { GameScene } from "./scenes/gameScene";
import { LoadingScene } from "./scenes/loadingScene";
import { dat } from "./game/loadLevel";
import { Input, Master } from "guppy-lib";

io('http://localhost:3000');

// set up keyboard
Input.initialize();
Input.addBind('right', ['KeyD', 'ArrowRight']);
Input.addBind('left', ['KeyA', 'ArrowLeft']);
Input.addBind('up', ['KeyW', 'ArrowUp']);
Input.addBind('down', ['KeyS', 'ArrowDown']);

// Set up MASTER
Master.initialize(document.getElementById("game-canvas"));

// OK RUN NOW
Master.changeScene(LoadingScene.load(GameScene));

setInterval(Master.tick, 25);