import WebSocket from 'ws';

export enum MessageTypes {
    data = 'data'
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

    send = (data: MessageImpl)=>{
        this.ws.onopen = () => this.ws.send(JSON.stringify({
            type: data.type || MessageTypes.data,
            data: data.data
        }));
    }
}