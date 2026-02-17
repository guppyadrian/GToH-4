import { Canvas, Input } from "guppy-lib";
import { Multiplayer } from "../multiplayer";
import { runCommand } from "./commands";

interface ChatMessage {
    author: string,
    text: string,
    timeSent: number
}

export const chatbox = document.getElementById('chatbox')! as HTMLInputElement;

const MAX_MESSAGES = 28;

export class ChatSystem {
    chatlog: ChatMessage[] = [];
    chatting: boolean;

    get connected() {
        return Multiplayer.started && Multiplayer.connected;
    }
    
    constructor() {
        Multiplayer.chatSystem = this;
        this.chatting = false;
        chatbox.addEventListener('keydown', this.onKeyDown);
    }

    private onKeyDown = (e: KeyboardEvent) => {
        if (e.code !== 'Enter') return;
        this.finishChatting();
    }

    destroy() {
        chatbox.removeEventListener('keydown', this.onKeyDown);
    }

    startChatting() {
        chatbox.hidden = false;
        chatbox.value = '';
        this.chatting = true;
        chatbox.focus();
    }

    finishChatting(sendMessage = true) {
        const msg = chatbox.value;
        Input.reset();
        chatbox.hidden = true;
        this.chatting = false;
        if (msg === '' || !sendMessage) return;

        if (msg[0] === '/') runCommand(msg.substring(1, msg.length));
        else this.sendMessage(msg);
    }

    draw() {
        const time = Date.now();
        const pressingTab = Input.get('show-chat');
        Canvas.ctx.textAlign = 'left';
        Canvas.ctx.font = '20px MinecraftRegular';
        for (let i = 0; i < this.chatlog.length; i++) {
            const msg = this.chatlog[i];
            if (!this.chatting && !pressingTab && time - msg.timeSent > 10 * 1000) break; // don't send messages after 10 seconds.
            Canvas.ctx.fillText(`${msg.author}: ${msg.text}`, 10, Canvas.height - 40 - 28 * i);
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
        if (this.chatlog.length > MAX_MESSAGES) {
            this.chatlog.pop();
        }
    }
}