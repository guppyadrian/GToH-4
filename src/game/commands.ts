import { Master } from "guppy-lib";
import type { GameScene } from "../scenes/gameScene";

type commandArg = 'string' | 'number'; // TODO: make a server command class that sends cmd to the server

export abstract class Command {
    // needs a name
    // needs arguments with a type
    // needs an execute method
    // needs a valid method

    name: string;
    argTypes: string[];

    get argc() {
        return this.argTypes.length;
    }

    constructor(name: string, ...args: commandArg[]) {
        this.name = name;
        this.argTypes = [...args];
    }

    validate(args: string[]) {
        if (args.length != this.argc) return false;
        if (args.every((arg, i) => this.argTypes[i] === typeof arg)) return true;
    }
}
// TODO: actually implement this command structure

// executes a command
export function runCommand(msg: string) {

    const args = msg.split(' ');
    const cmd = args.shift();

    switch (cmd) {
        case 'god':
            const scene = Master.currentScene as GameScene;
            scene.player.godMode = !scene.player.godMode;
            scene.visualPlayer.godMode = !scene.visualPlayer.godMode; 
            break;
    }
}