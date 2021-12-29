import WebSocket from 'ws';

class wsClient {
    private wsServer;

    constructor(server) {
        if (!server) {
            return;
        }
        this.wsServer = new WebSocket.Server({ server });
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

const wsClientInstance = new wsClient(null);

export default wsClientInstance;
