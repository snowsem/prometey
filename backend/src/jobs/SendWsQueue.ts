import {VirtualEnv} from "../entity/VirtualEnv";
import {getRepository} from "typeorm";
import {createBranch} from "../cron/createBranch";
import {deleteEnv} from "../cron/deleteEnv";
import {MessageImpl, WsClient} from "../ws/client";

const Queue = require('bull');

export class SendWsQueue {

    private queue: any;
    private wsClient: any;

    constructor(){
        this.wsClient = null;
        this.queue = new Queue('sendWsQueue');
    }

    send(msg: MessageImpl){
        this.queue.add('sendWsQueue', msg)
        this.queue.close()
    }

    run = async ()=>{
        if (!this.wsClient)this.wsClient = new WsClient();
        this.queue.process('sendWsQueue', job => {
            this.handle(job)
        })

        this.queue.on('completed', function (job, result) {
            console.log('job completed', 'msg send')
        })
    }
     handle = async(job)=>{
        try {
            await this.wsClient.sendBroadcast(job.data)
            job.moveToCompleted('done', true)
        } catch (error) {
            if (error.response) {
                job.moveToFailed({message: 'job failed'})
            }
        }
    }

    close = ()=>{
        this.queue.close()
    }
}

