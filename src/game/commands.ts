import { Master } from "guppy-lib";
import type { GameScene } from "../scenes/gameScene";
import { Multiplayer } from "../multiplayer";

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

    const scene = Master.currentScene as GameScene;

    switch (cmd) {
        case 'god':
            scene.player.godMode = !scene.player.godMode;
            scene.visualPlayer.godMode = !scene.visualPlayer.godMode; 
            break;
        case 'ip':
            let ipAddr = args[0]; // TODO: add http:// automatically ONLY if its missing
            if (ipAddr.substring(0, 8) !== 'https://' && ipAddr.substring(0, 7) !== 'http://') ipAddr = 'https://' + ipAddr;
            console.log('connecting to', ipAddr);
            Multiplayer.restart(ipAddr).then(() => {
                Multiplayer.ready();
            }).catch(() => {
                Multiplayer.chatSystem.addMessageToLog("[System]", "Could not connect to server!");
            });
            break;
        case 'ban':
            if (!args[0]) {
                Multiplayer.chatSystem.addMessageToLog("[Notice]", "You must enter a username!");
                break;
            }
            Multiplayer.socket.emit('ban', args[0]);
            break;
        case 'unban':
            if (!args[0]) {
                Multiplayer.chatSystem.addMessageToLog("[Notice]", "You must enter a username!");
                break;
            }
            Multiplayer.socket.emit('pardon', args[0]);
            break;
    }
}