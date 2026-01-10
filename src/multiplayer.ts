import { io, Socket } from "socket.io-client";

class Multiplayer
{
    static started = false;
    static socket: Socket;

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
        Multiplayer.started = true;

        return true;
    }

    private static onConnection()
    {
        console.log("connected to server!");
    }
}

export { Multiplayer };