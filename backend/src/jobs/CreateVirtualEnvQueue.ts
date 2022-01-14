import {VirtualEnv} from "../entity/VirtualEnv";
import {getRepository} from "typeorm";
import {createBranch} from "../cron/createBranch";

const Queue = require('bull');

export class CreateVirtualEnvQueue {

    private queue: any;

    constructor(){
        this.queue = new Queue('createVirtualEnv');
    }

    addVirtualEnvQueue(id){
        this.queue.add('createVirtualEnv', {id:id})
    }

    run = ()=>{
        this.queue.process('createVirtualEnv', job => {
            this.handle(job)
        })

        this.queue.on('completed', function (job, result) {
            console.log('job completed', result)
        })
    }
     handle = async(job)=>{
        try {
            const virtualEnvId = job.data.id
            const envs = await getRepository(VirtualEnv).find(
                    {
                        where: [
                            {id: virtualEnvId},
                        ],
                        relations: ['virtualEnvServices', 'user']
                    }
                );
            await createBranch(envs)

            job.moveToCompleted('done', true)
            return `success create env by id: ${virtualEnvId}`
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

