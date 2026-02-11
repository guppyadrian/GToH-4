import { io, Socket } from "socket.io-client";
import { OnlinePlayer } from "./game/multiplayer/onlinePlayer";
import type { Player } from "./game/player";
import { GameState } from "./scenes/gameScene";
import { requestedUsername, setLoginStatus } from "./account";

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
    static _uuid: UUID;
    static username = 'Guest';

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

    static start(serverIP: string)
    {
        if (Multiplayer.started) return false;

        Multiplayer.socket = io(serverIP, {
            reconnectionAttempts: 2
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
            } else {
                setLoginStatus(message);
            }
            // TODO: also send over username
        });

        Multiplayer.started = true;

        return true;
    }

    private static onConnection()
    {
        console.log("connected to server!");
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
    }

    private static onPlayerLeave(uuid: UUID)
    {
        Multiplayer.playerList.delete(uuid);
    }

    static attemptLogin(username: string, password: string)
    {
        Multiplayer.socket.emit('attempt-login', username, password);
    }
}

export { Multiplayer };