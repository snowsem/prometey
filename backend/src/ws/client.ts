import WebSocket from 'ws';

export enum MessageTypes {
    data = 'data',
    updateVirtualEnv = 'updateVirtualEnv'
}

interface MessageImpl {
    type: MessageTypes,
    data: object
}


export class WsClient {
    private ws: WebSocket

    constructor() {
        this.ws = new WebSocket('ws://localhost:8888');

        this.ws.on('open', (ws)=> {
            console.log('open')
            this.ws.send('something');
        });

        this.ws.on('message', (data)=> {
            //th/ws.send('something1');
            console.log('received: %s', data);
        });

    }

    waitForOpenConnection = (socket) => {
        return new Promise<void>((resolve, reject) => {
            const maxNumberOfAttempts = 10
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



    sendMessage = async (data: MessageImpl) => {
        if (this.ws.readyState !== this.ws.OPEN) {
            try {
                await this.waitForOpenConnection(this.ws)
                this.ws.send(JSON.stringify({
                    type: data.type || MessageTypes.data,
                    data: data.data
                }));
            } catch (err) { console.error(err) }
        } else {
            this.ws.send(JSON.stringify({
                type: data.type || MessageTypes.data,
                data: data.data
            }));
        }
    }
}