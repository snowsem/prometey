import WebSocket from 'ws';
import {log} from "winston";

class WsServer {
    private wsServer;
    private static instance: WsServer;

    constructor(server) {
        if (WsServer.instance) {
            return WsServer.instance;
        }
        if (server) {
            this.wsServer = new WebSocket.Server({ server });
        }
        WsServer.instance = this;
    }

    init(server) {
        this.wsServer = new WebSocket.Server({ server });

        this.wsServer.on('connection', (ws, request, client) => {
            console.log('client connected');
            ws.send('hello client')

            ws.on('message', (data, isBinary) => {
                console.log('client say:', data)
                this.wsServer.clients.forEach(client => client.send(data, { binary: isBinary }));
            });
        });

        this.wsServer.on("error", e => this.wsServer.send(e));
    }

    send(message) {
        this.wsServer.clients.forEach(client => {
            if (client && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message))
            }
        });
    }
}

const wsClientInstance = new WsServer(null);

export default wsClientInstance;
