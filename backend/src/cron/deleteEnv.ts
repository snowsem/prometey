import {MicroInfraService} from "../services/MicroInfraService";
import {stringify as yamlStr} from 'yaml';
import {base64encode} from 'nodejs-base64';
import {createConnection, getRepository} from "typeorm";
import {VirtualEnv, VirtualEnvStatus} from "../entity/VirtualEnv";
import {MicroInfraRepoService} from "../services/MicroInfraRepoService";
import {MessageTypes, WsClient} from "../ws/client";
//import wsClient  from '../wsClient';


export const deleteEnv = async (envs = [])=>{

    const infraService = new MicroInfraService();
    const repoService = new MicroInfraRepoService()
    await repoService.getRepo(process.env.GITHUB_REPO_BRANCH)
    const virtualEnvRepository = getRepository(VirtualEnv);

    if (envs.length<1) {
         envs = await getRepository(VirtualEnv).find(
            {
                where: [
                    {status: VirtualEnvStatus.WAIT_DELETE},
                ],
                relations: ['virtualEnvServices']
            }
        )
    }

    if (envs.length>0) {
        try {
            const newBranch = `venv-autosyc-${Date.now().toString()}`
            const b = await infraService.createBranch(newBranch);

            const mapEnv = envs.map(async env=>{
                const values = repoService.getAllValuesPathByVirtualEnv(env.title)
                console.log(values)
                const map = values.map( async valuePath => {
                    return await infraService.deleteFileInBranch(valuePath, newBranch,`Delete file ${valuePath}`)
                });
                await Promise.all(map);
                await virtualEnvRepository.delete({
                    id: env.id
                })
            });
            await Promise.all(mapEnv)

            const e = await infraService.merge(process.env.GITHUB_REPO_OWNER, newBranch)



        } catch (e) {
            console.log(e)
            throw e
        }

    }

}




