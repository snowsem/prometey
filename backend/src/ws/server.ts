import WebSocket from 'ws';
import {log} from "winston";
import {setWsHeartbeat} from "ws-heartbeat/server";

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

        setWsHeartbeat(this.wsServer, (ws, data, binary) => {
            console.log('pong server', data.toString())
            if (data.toString() === '{"kind":"ping"}') { // send pong if recieved a ping.
                console.log('pong server', data)
                ws.send('{"kind":"pong"}', {binary: false})
            }
        },  4000);

        this.wsServer.on('connection', (ws, request, client) => {
            console.log('client connected');
            ws.send('hello client')

            ws.on('message', (data, isBinary) => {
                console.log('client say:', data)
                this.wsServer.clients.forEach(client => {
                    if (client && client.readyState === WebSocket.OPEN && client !== ws) {
                        client.send(data, {binary: isBinary})
                    }
                });
            });
        });

        this.wsServer.on("error", e => this.wsServer.send(e));
    }

    send(message, ws) {
        this.wsServer.clients.forEach(client => {
            if (client && client.readyState === WebSocket.OPEN && client !== WebSocket) {
                client.send(JSON.stringify(message))
            }
        });
    }
}

const wsClientInstance = new WsServer(null);

export default wsClientInstance;
