import WebSocket from 'ws';

class WsClient {
    private wsServer;
    private static instance: WsClient;

    constructor(server) {
        if (WsClient.instance) {
            return WsClient.instance;
        }
        if (server) {
            this.wsServer = new WebSocket.Server({ server });
        }
        WsClient.instance = this;
    }

    init(server) {
        this.wsServer = new WebSocket.Server({ server });
        this.wsServer.on('message', m => {
            this.wsServer.clients.forEach(client => client.send(m));
        });
        this.wsServer.on("error", e => this.wsServer.send(e));
    }

    on(event, cb) {
        return this.wsServer.on(event, cb);
    }

    send(message) {
        this.wsServer.clients.forEach(client => {
            if (client && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message))
            }
        });
    }
}

const wsClientInstance = new WsClient(null);

export default wsClientInstance;
