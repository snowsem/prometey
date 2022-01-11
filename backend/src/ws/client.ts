import WebSocket from 'ws';

import io from 'socket.io-client'

export enum MessageTypes {
    data = 'data',
    updateVirtualEnv = 'updateVirtualEnv'
}

export interface MessageImpl {
    type: MessageTypes,
    data: object
}


export class WsClient {
    private ws: WebSocket

    constructor() {
        this.ws = io.connect('ws://localhost:8888', {
            reconnect: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax : 5000,
            reconnectionAttempts: 10
        })
        this.ws.on('connect', function (socket) {
            console.log('Connected!');
        });

        this.ws.on('message', (msg)=>{
            console.log('message from server:', msg)
        })

        this.ws.on('disconnect', (reason) => {
            console.log("client disconnected");
            if (reason === 'io server disconnect') {
                // the disconnection was initiated by the server, you need to reconnect manually
                console.log("server disconnected the client, trying to reconnect");
                this.ws.connect();
            }else{
                console.log("trying to reconnect again with server");
            }
            // else the socket will automatically try to reconnect
        });

        this.ws.on('error', (error) => {
            console.log(error);
        });

        //this.ws.emit('CH01', 'me', 'test msg');

    }

    waitForOpenConnection = (socket) => {
        return new Promise<void>((resolve, reject) => {
            const maxNumberOfAttempts = 30
            const intervalTime = 200 //ms

            let currentAttempt = 0
            const interval = setInterval(() => {
                if (currentAttempt > maxNumberOfAttempts - 1) {
                    clearInterval(interval)
                    reject(new Error('Maximum number of attempts exceeded'))
                } else if (socket.readyState === socket.OPEN) {
                    clearInterval(interval)
                    resolve()
                }
                currentAttempt++
            }, intervalTime)
        })
    }


    sendBroadcast = async (data: MessageImpl) => {
        console.log(data)
        this.ws.emit('broadcast', data)
    }

    sendMessage = async (data: MessageImpl) => {
        console.log(data)
        this.ws.emit('message', data);
        //this.ws.emit('broadcast', data)
        //this.ws.emit('CH01', 'me', data);

        // if (this.ws.readyState !== this.ws.OPEN) {
        //     try {
        //         await this.waitForOpenConnection(this.ws)
        //         this.ws.send(JSON.stringify({
        //             type: data.type || MessageTypes.data,
        //             data: data.data
        //         }));
        //     } catch (err) { console.error(err) }
        // } else {
        //     this.ws.send(JSON.stringify({
        //         type: data.type || MessageTypes.data,
        //         data: data.data
        //     }));
        // }
    }
    close = ()=>{
        this.ws.close()
    }
}