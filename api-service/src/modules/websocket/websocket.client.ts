import {Injectable, Logger} from "@nestjs/common";
import {io} from 'socket.io-client'

@Injectable()
export class WebsocketClient {
    private ws: any;
    private readonly logger = new Logger(WebsocketClient.name);

    constructor() {
        this.ws = io(`ws://${process.env.APP_HOST}:${process.env.APP_PORT}`, {
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 10,
            reconnection: true
        })
        this.ws.on('connect', (socket, a)=> {
            this.logger.debug('ws client connected')
        });

        this.ws.on('message', (msg) => {
            console.log('message from server:', msg)
        })

        this.ws.on('disconnect', (reason) => {

            this.logger.debug('client disconnected')
            if (reason === 'io server disconnect') {
                // the disconnection was initiated by the server, you need to reconnect manually
                console.log("server disconnected the client, trying to reconnect");
                this.ws.connect();
            } else if (reason === 'io client disconnect') {
                console.log("client:", reason);
            } else {
                console.log(reason)
            }
            // else the socket will automatically try to reconnect
        });

        this.ws.on('error', (error) => {
            console.log(error);
        });

    }

    sendBroadcast = async (data: MessageImpl) => {
        this.ws.emit('broadcast', data)
    }

    sendMessage = async (data: MessageImpl) => {
        this.ws.emit('message', data);
    }
    close = () => {
        console.log('close c')
        this.ws.close()
    }
}

export enum MessageTypes {
    data = 'data',
    updateVirtualEnv = 'updateVirtualEnv'
}

export interface MessageImpl {
    type: MessageTypes,
    data: object
}
