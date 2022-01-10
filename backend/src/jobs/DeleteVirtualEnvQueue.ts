import {VirtualEnv} from "../entity/VirtualEnv";
import {getRepository} from "typeorm";
import {createBranch} from "../cron/createBranch";
import {deleteEnv} from "../cron/deleteEnv";

const Queue = require('bull');

export class DeleteVirtualEnvQueue {

    private queue: any;

    constructor(){
        this.queue = new Queue('deleteVirtualEnv');
    }

    deleteVirtualEnvQueue(id){
        this.queue.add('deleteVirtualEnv', {id:id})
    }

    run = ()=>{
        this.queue.process('deleteVirtualEnv', job => {
            this.handle(job)
        })

        this.queue.on('completed', function (job, result) {
            console.log('job completed', 'Env deleted')
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
                        relations: ['virtualEnvServices']
                    }
                );
            await deleteEnv(envs)

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

