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
Input.addBind('login', ['KeyL']);
Input.addBind('chat', ['KeyT', 'Slash']);
Input.addBind('show-chat', ['Tab']);

window.addEventListener('keydown', e => {if (e.code === "Tab") e.preventDefault()})

// instead of master we testing webgl
//GL.initialize(document.getElementById("game-canvas") as HTMLCanvasElement);

Multiplayer.start('https://superguppysite.org');
// Set up MASTER
Master.initialize(document.getElementById("game-canvas") as HTMLCanvasElement, 40);

// OK RUN NOW
Master.changeScene(new LoadingScene(GameScene));


Master.start()

