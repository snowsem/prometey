import {MicroInfraService} from "../services/MicroInfraService";
import {stringify as yamlStr} from 'yaml';
import {base64encode} from 'nodejs-base64';
import {createConnection, getRepository} from "typeorm";
import {VirtualEnv, VirtualEnvStatus} from "../entity/VirtualEnv";
import {MicroInfraRepoService} from "../services/MicroInfraRepoService";
import {MessageTypes, WsClient} from "../ws/client";
//import wsClient  from '../wsClient';


export const createBranch = async (envs = [])=>{

    const wsClient = new WsClient();
    const infraService = new MicroInfraService();
    const repoService = new MicroInfraRepoService()
    await repoService.getRepo('custom-main')

    if (envs.length<1) {
         envs = await getRepository(VirtualEnv).find(
            {
                where: [
                    {status: VirtualEnvStatus.PENDING},
                    {status: VirtualEnvStatus.WAIT_PR},
                ],
                relations: ['virtualEnvServices']
            }
        )
    }


    if (envs.length>0) {
        const newBranch = `venv-autosyc-${Date.now().toString()}`
        const values = await repoService.getAllValues()
        //const a = await infraService.deleteBranch('semen-branch')
        const b = await infraService.createBranch(newBranch);

        envs.map( async (env)=>{
            const valuesMap = env.virtualEnvServices.map( async (srv)=>{

                //console.log(srv)
                if (srv.service_github_tag) {

                    let value = await repoService.getServiceDefaultValue(srv.service_name)
                    value.image.tag = srv.service_github_tag
                    value.deployment_variant = env.title
                    value = yamlStr({
                        global: {...value}
                    })

                    return infraService.createOrUpdateFileInBranch(
                        base64encode(value),
                        `api/${srv.service_name}/stage/values-${env.title}.yaml`,
                        newBranch,
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
                        const remove = await infraService.deleteFileInBranch(removeFilePath, newBranch,'Delete file')
                    }

                }
            })
            const vp = await Promise.all(valuesMap)
            env.status = VirtualEnvStatus.READY;
            await env.save();
            await wsClient.sendMessage({
                data: env,
                type: MessageTypes.updateVirtualEnv
            })

        });
    }
    wsClient.close()
}



