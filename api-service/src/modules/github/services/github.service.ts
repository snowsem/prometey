import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {MicroInfraApiService} from './micro-infra-api.service';
import {MicroInfraRepoService} from './micro-infra-repo.service';
import {VirtualEnvStatus} from '../../virtual-env/entity/virtual-env.entity';
import {stringify as yamlStr} from 'yaml';
import {base64encode} from 'nodejs-base64';
import {VenvService} from '../../virtual-env/services/venv.service';
import {MessageTypes, WebsocketClient} from "../../websocket/websocket.client";
import {SendMessageWsProcessor} from "../../websocket/processors/send-message-ws.processor";

@Injectable()
export class GithubService {
    constructor(
        @Inject(MicroInfraApiService)
        private infraService: MicroInfraApiService,
        @Inject(MicroInfraRepoService)
        private repoService: MicroInfraRepoService,
        @Inject(forwardRef(() => VenvService))
        private venvService: VenvService,
        @Inject(WebsocketClient)
        private wsClient: WebsocketClient,
        @Inject(SendMessageWsProcessor)
        private sendMessageQueue: SendMessageWsProcessor
    ) {
    }

    createBranch = async (envs = []) => {
        try {
            await this.repoService.getRepo(process.env.GITHUB_REPO_BRANCH);

            if (envs.length < 1) {
                const getEnvs = await this.venvService.find({
                    where: [
                        {status: VirtualEnvStatus.PENDING},
                        {status: VirtualEnvStatus.WAIT_PR},
                    ],
                    relations: ['virtualEnvServices', 'user'],
                });
                envs = getEnvs?.data;
            }

            if (envs.length > 0) {
                const newBranch = `venv-autosyc-${Date.now().toString()}`;
                const values = this.repoService.getAllValues();
                //const a = await infraService.deleteBranch('semen-branch')
                const b = await this.infraService.createBranch(newBranch);
                envs.map(async (env) => {
                    const valuesMap = env.virtualEnvServices.map(async (srv) => {
                        //console.log(srv)
                        if (srv.service_github_tag) {
                            let value = await this.repoService.getServiceDefaultValue(
                                srv.service_name,
                            );
                            value.image.tag = srv.service_github_tag;
                            value.deployment_variant = env.title;
                            value = yamlStr({
                                global: {...value},
                            });

                            return this.infraService.createOrUpdateFileInBranch(
                                base64encode(value),
                                `api/${srv.service_name}/stage/values-${env.title}.yaml`,
                                newBranch,
                                `Sync Virtual env: ${env.title}`,
                            );
                        } else {
                            let removeFilePath = null;
                            values.forEach((service) => {
                                if (service.serviceName === srv.service_name) {
                                    service.values.forEach((value) => {
                                        if (value === `values-${env.title}.yaml`) {
                                            removeFilePath = `api/${srv.service_name}/stage/values-${env.title}.yaml`;
                                        }
                                    });
                                }
                            });
                            if (removeFilePath) {
                                const remove = await this.infraService.deleteFileInBranch(
                                    removeFilePath,
                                    newBranch,
                                    'Delete file',
                                );
                            }
                        }
                    });
                    const vp = await Promise.all(valuesMap);
                    env.status = VirtualEnvStatus.READY;
                    await env.save();
                    const merge = await this.infraService.merge(
                        process.env.GITHUB_REPO_OWNER,
                        newBranch,
                    );
                    const deleteBranch = await this.infraService.deleteBranch(newBranch);
                    this.sendMessageQueue.sendBroadcast({
                        data: env,
                        type: MessageTypes.updateVirtualEnv

                    })
                    // const msg = new SendWsQueue().send({
                    //     data: env,
                    //     type: MessageTypes.updateVirtualEnv
                    //
                    // })
                });
            }
            return 'success';
        } catch (e) {
            console.log(e);
            throw Error(e);
        }
    };

    deleteEnv = async (envs = []) => {
        await this.repoService.getRepo(process.env.GITHUB_REPO_BRANCH);
        if (envs.length < 1) {
            const getEnvs = await this.venvService.find({
                where: [{status: VirtualEnvStatus.WAIT_DELETE}],
                relations: ['virtualEnvServices'],
            });

            envs = getEnvs?.data;
        }

        if (envs.length > 0) {
            try {
                const newBranch = `venv-autosyc-${Date.now().toString()}`;
                const b = await this.infraService.createBranch(newBranch);

                const mapEnv = envs.map(async (env) => {
                    const values = this.repoService.getAllValuesPathByVirtualEnv(
                        env.title,
                    );
                    console.log(values);
                    const map = values.map(async (valuePath) => {
                        return await this.infraService.deleteFileInBranch(
                            valuePath,
                            newBranch,
                            `Delete file ${valuePath}`,
                        );
                    });
                    await Promise.all(map);
                    await this.venvService.deleteEntity(env.id);
                    await this.sendMessageQueue.sendBroadcast({
                        data: {id:env.id},
                        type: MessageTypes.deleteVirtualEnv

                    })
                });
                await Promise.all(mapEnv);

                const e = await this.infraService.merge(
                    process.env.GITHUB_REPO_OWNER,
                    newBranch,
                );

                const deleteBranch = await this.infraService.deleteBranch(newBranch);

            } catch (e) {
                console.log(e);
                throw e;
            }
        }
    };
}
