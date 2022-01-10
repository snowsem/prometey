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
    await repoService.getRepo('venv-autosyc-1641835321040')
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
        envs.map(async env=>{
            const newBranch = `venv-autosyc-${Date.now().toString()}`
            const values = repoService.getAllValuesPathByVirtualEnv(env.title)
            const map = values.map( async valuePath => {
                await infraService.deleteFileInBranch(valuePath, 'venv-autosyc-1641835321040',`Delete file ${valuePath}`)
            });
            await Promise.all(map);
            await virtualEnvRepository.delete({
                id: env.id
            })
        })
    }

}
createConnection();
deleteEnv()



