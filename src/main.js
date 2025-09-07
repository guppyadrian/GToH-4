import { io } from "socket.io-client";
import { Input } from "./libs/input";
import { Master } from "./libs/master";
import { GameScene } from "./scenes/gameScene";

io('http://localhost:3000');

// set up keyboard
Input.initialize();
Input.addBind('right', ['KeyD', 'ArrowRight']);
Input.addBind('left', ['KeyA', 'ArrowLeft']);
Input.addBind('up', ['KeyW', 'ArrowUp']);
Input.addBind('down', ['KeyS', 'ArrowDown']);

// Set up MASTER
Master.initialize(document.getElementById("game-canvas"));

// Load assets
const someTime = Date.now();
GameScene.preload().then(() => {
  console.log("took:", Date.now() - someTime, "ms to load");
});

// OK RUN NOW
Master.changeScene(new GameScene());

//Master.currentScene.player.vel.x = 1;

setInterval(Master.tick, 25);

