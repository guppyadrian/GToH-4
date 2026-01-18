import { GameScene } from "./scenes/gameScene";
import { LoadingScene } from "./scenes/loadingScene.js";
import { Input, Master } from "guppy-lib";
//import { MainMenuScene } from "./scenes/mainMenuScene.js";
import { Multiplayer } from "./multiplayer.js";

// set up keyboard
Input.initialize();
Input.addBind('swap', ['Space']);
Input.addBind('right', ['KeyD', 'ArrowRight']);
Input.addBind('left', ['KeyA', 'ArrowLeft']);
Input.addBind('up', ['KeyW', 'ArrowUp']);
Input.addBind('down', ['KeyS', 'ArrowDown']);
Input.addBind('exit', ['KeyR']);
Input.addBind('options', ['KeyO']);
Input.addBind('load-level', ['KeyL']);

// instead of master we testing webgl
//GL.initialize(document.getElementById("game-canvas") as HTMLCanvasElement);

Multiplayer.start('10.59.64.100:3000');

// Set up MASTER
Master.initialize(document.getElementById("game-canvas") as HTMLCanvasElement, 40);

// OK RUN NOW
Master.changeScene(new LoadingScene(GameScene));


Master.start()