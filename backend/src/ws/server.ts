import { Server } from "socket.io";

class WsServer {
    private wsServer;
    private static instance: WsServer;

    constructor(server) {
        if (WsServer.instance) {
            return WsServer.instance;
        }
        if (server) {
            this.wsServer = new Server(server, {
                cors: {
                    origin: '*:*',
                }});
        }
        WsServer.instance = this;
    }

    init(server) {
        this.wsServer = new Server(server, {
            pingTimeout: 10000,
            pingInterval: 30000,
            cors: {
                origin: '*',
            }});

        //this.wsServer.sockets.emit('message', "WS server is Alive");
        this.wsServer.on("connection", (socket) => {
            console.log('A user connected');

            socket.on('disconnect', function () {
                console.log('A user disconnected');
            });

            socket.on('CH01', function (from, msg) {
                console.log('MSG', from, ' saying ', msg);
            });

            socket.on('message', function (msg) {
                console.log('message:',msg);
            });

            socket.on('broadcast', function (msg) {
                socket.broadcast.emit('broadcast', msg)
                console.log('message:',msg);
            });
        });
    }

    send(message, ws) {
    }
}

const wsClientInstance = new WsServer(null);

export default wsClientInstance;
