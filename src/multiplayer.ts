import { io, Socket } from "socket.io-client";
import { OnlinePlayer } from "./game/multiplayer/onlinePlayer";
import type { Player } from "./game/player";
import { GameState } from "./scenes/gameScene";
import { attemptAutoLogin, requestedPassword, requestedUsername, setLoginStatus } from "./account";
import type { ChatSystem } from "./game/chat";
type UUID = string;

type PlayerPacket =
[
    uuid: UUID,
    x: number,
    y: number,
];

class Multiplayer
{
    static started = false;
    static socket: Socket;
    static playerList: Map<UUID, OnlinePlayer> = new Map();
    private static _uuid: UUID;
    static username = 'Guest';
    private static _chatSystem: ChatSystem;

    static get chatSystem() {
        return this._chatSystem;
    }

    static set chatSystem(val) {
        
        this._chatSystem = val;
    }

    static get uuid() {
        return this._uuid;
    }

    static set uuid(value) {
        this._uuid = value;
        console.log("new UUID:", value);
    }

    static get connected()
    {
        if (!Multiplayer.started) return false;
        return Multiplayer.socket.connected;
    }

    static restart(serverIP: string)
    {
        Multiplayer.socket.disconnect();
        Multiplayer.started = false;
        Multiplayer.start(serverIP);

        return new Promise<void>((resolve, reject) => {
            Multiplayer.socket.once('connect', () => { resolve() });
            Multiplayer.socket.once('connect_error', () => { reject( )});
        })
    }

    static start(serverIP: string)
    {
        if (Multiplayer.started) return false;

        Multiplayer.socket = io(serverIP, {
            //reconnectionAttempts: 5,
            transports: ["websocket"]
        });

        Multiplayer.socket.on("connect", this.onConnection);
        Multiplayer.socket.on('player-join', this.onPlayerJoin);
        Multiplayer.socket.on('player-leave', this.onPlayerLeave);
        Multiplayer.socket.on('send-player', this.onSendPlayer);
        Multiplayer.socket.on('send-uuid', (uuid) => {Multiplayer.uuid = uuid});
        Multiplayer.socket.on('player-changed-level', (packet) => {
            const uuid: UUID = packet[0];
            const level: number = packet[1];
            const player = Multiplayer.playerList.get(uuid);

            if (!player) {
                console.log("Unknown player was trying to change level!");
                return;
            }
            player.level = level;
        });

        Multiplayer.socket.on('login-result', (success, message) => {
            if (success) {
                Multiplayer.uuid = message;
                Multiplayer.username = requestedUsername;
                setLoginStatus("Successfully logged in! You can go back to the game now");
                localStorage.setItem('gtoh-password', requestedPassword);
                localStorage.setItem('gtoh-username', requestedUsername);
            } else {
                setLoginStatus(message);
            }
            // TODO: also send over username
        });

        Multiplayer.socket.on('send-message', (author: string, text: string) => { // TODO: if scene gets reloaded how does this work?
            this.chatSystem.addMessageToLog(author, text);
        });

        Multiplayer.socket.on('toggle-afk', (uuid: string, afk: boolean) => {
            const player = Multiplayer.playerList.get(uuid);
            if (player) player.afk = afk;
        });

        Multiplayer.started = true;

        return true;
    }

    private static onConnection()
    {
        Multiplayer.username = 'Guest';
        Multiplayer.playerList.clear();
        console.log("connected to server!");
        const username = localStorage.getItem('gtoh-username');
        const password = localStorage.getItem('gtoh-password');
        if (!username || !password) return;
        attemptAutoLogin(username, password);
    }

    static sendPlayer(player: Player)
    {
        const packet = [player.x, player.y, GameState.currentLevel];

        Multiplayer.socket.emit('send-player', packet);
    }

    private static onSendPlayer(packets: PlayerPacket[])
    {
        for (let i = 0; i < packets.length; i++)
        {
            const packet = packets[i];
            const player = Multiplayer.playerList.get(packet[0]); // TODO: be safe. remove exclamation point

            if (!player) continue;
            if (player.uuid === Multiplayer.uuid) continue;

            player.vx = player.x;
            player.vy = player.y;
            player.x = packet[1];
            player.y = packet[2];
        }
    }

    private static onPlayerJoin(uuid: UUID, username: string)
    {
        Multiplayer.playerList.set(uuid, new OnlinePlayer(uuid, username));
        if (username !== 'Guest')
            Multiplayer.chatSystem.addMessageToLog('[Server]', `${username} has joined!`);
    }

    private static onPlayerLeave(uuid: UUID)
    {
        const username = Multiplayer.playerList.get(uuid)?.username;
        Multiplayer.playerList.delete(uuid);
        if (username && username !== 'Guest')
            Multiplayer.chatSystem.addMessageToLog('[Server]', `${username} has left!`);
    }

    static attemptLogin(username: string, password: string, registering = false)
    {
        Multiplayer.socket.emit(registering ? 'attempt-register' : 'attempt-login', username, password);
    }

    static ready()
    {
        Multiplayer.socket.emit('player-ready');
    }

    static getPlayer(username: string) {
        return [...Multiplayer.playerList.values()].find(p => p.username === username);
        
    }

    static alert(text: string) {
        Multiplayer.chatSystem.addMessageToLog('[Notice]', text);
    }
}

export { Multiplayer };
