import {MicroInfraService} from "../services/MicroInfraService";
import {stringify as yamlStr} from 'yaml';
import {base64encode} from 'nodejs-base64';
import dotenv from 'dotenv';
import {createConnection, getRepository} from "typeorm";
import {AppLogger} from "../logger";
import {VirtualEnv, VirtualEnvStatus} from "../entity/VirtualEnv";
//import wsClient  from '../wsClient';

export const createBranch = async ()=>{

    const infraService = new MicroInfraService();
     const values = await infraService.getValues('semen-branch')

    const envs = await getRepository(VirtualEnv).find(
        {
            where: [
                {status: VirtualEnvStatus.PENDING},
                {status: VirtualEnvStatus.WAIT_PR},
            ],
            relations: ['virtualEnvServices']
        }
    )

    if (envs.length>0) {
        const a = await infraService.deleteBranch('semen-branch')
        const b = await infraService.createBranch('semen-branch');

        envs.map( async (env)=>{
            const valuesMap = env.virtualEnvServices.map( async (srv)=>{

                //console.log(srv)
                if (srv.service_github_tag) {

                    let value = await infraService.getServiceValue(srv.service_name)
                    value.image.tag = srv.service_github_tag
                    value.deployment_variant = env.title
                    value = yamlStr({
                        global: {...value}
                    })

                    return infraService.createOrUpdateFileInBranch(
                        base64encode(value),
                        `api/${srv.service_name}/stage/values-${env.title}.yaml`,
                        'semen-branch',
                        `Sync Virtual env: ${env.title}`
                    )
                } else {
                    let removeFilePath = null;
                    values.forEach((service)=>{
                        if (service.serviceName === srv.service_name) {
                            service.values.forEach(value=>{
                                if (value === `values-${env.title}.yaml`) {
                                    removeFilePath = `api/${srv.service_name}/stage/values-${env.title}.yaml`
                                }
                            })
                        }
                    })
                    if (removeFilePath) {
                        const remove = await infraService.deleteFileInBranch(removeFilePath, 'semen-branch','Delete file')
                    }

                }
            })
            const vp = await Promise.all(valuesMap)
            env.status = VirtualEnvStatus.READY;
            await env.save();
            //wsClient.send({ id: env.id, data:env });
        });
    }

}



