import { Canvas, Input } from "guppy-lib";
import { Multiplayer } from "../multiplayer";

interface ChatMessage {
    author: string,
    text: string,
    timeSent: number
}

export class ChatSystem {
    chatlog: ChatMessage[] = [];

    get connected() {
        return Multiplayer.started && Multiplayer.connected;
    }
    
    constructor() {
        Multiplayer.chatSystem = this;
    }

    draw() {
        const time = Date.now();
        const pressingTab = Input.get('show-chat');
        Canvas.ctx.textAlign = 'left';
        Canvas.ctx.font = '20px MinecraftRegular';
        for (let i = 0; i < this.chatlog.length; i++) {
            const msg = this.chatlog[i];
            if (!pressingTab && time - msg.timeSent > 10 * 1000) break; // don't send messages after 10 seconds.
            Canvas.ctx.fillText(`${msg.author}: ${msg.text}`, 10, Canvas.height - 40 - 24 * i);
        } 
        Canvas.ctx.textAlign = 'center';
    }

    // Precondition: Multiplayer is started
    sendMessage(text: string) {
        Multiplayer.socket.emit('send-message', text);
    }

    addMessageToLog(author: string, text: string) { // TODO: parameter for admin level!
        const msg: ChatMessage = {author, text, timeSent: Date.now()};
        this.chatlog.unshift(msg);
        if (this.chatlog.length > 50) {
            this.chatlog.pop();
        }
    }
}