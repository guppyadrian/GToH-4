import { io, Socket } from "socket.io-client";
import { OnlinePlayer } from "./game/multiplayer/onlinePlayer";
import type { Player } from "./game/player";
import { GameState } from "./scenes/gameScene";

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

    static get connected()
    {
        return Multiplayer.socket.connected;
    }

    static start()
    {
        if (Multiplayer.started) return false;

        Multiplayer.socket = io('http://localhost:3000', {
            reconnectionAttempts: 2
        });

        Multiplayer.socket.on("connect", this.onConnection);
        Multiplayer.socket.on('player-join', this.onPlayerJoin);
        Multiplayer.socket.on('player-leave', this.onPlayerLeave);
        Multiplayer.socket.on('send-player', this.onSendPlayer);
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

            player.x = packet[1];
            player.y = packet[2];
        }
    }

    private static onPlayerJoin(uuid: UUID)
    {
        Multiplayer.playerList.set(uuid, new OnlinePlayer(uuid));
    }

    private static onPlayerLeave(uuid: UUID)
    {
        Multiplayer.playerList.delete(uuid);
    }
}

export { Multiplayer };