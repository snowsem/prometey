import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from '@nestjs/typeorm';
import {CreateVirtualEnvDto} from "../dto/create-virtual-env.dto";
import {MicroInfraApiService} from "../../github/services/micro-infra-api.service";
import {VirtualEnv, VirtualEnvStatus} from "../entity/virtual-env.entity";
import {VirtualEnvService} from "../entity/virtual-env-service.entity";
import {MicroInfraService} from "../entity/micro-infra-service.entity";
import {_} from 'lodash'

@Injectable()
export class VenvService {

    constructor(
        @InjectRepository(VirtualEnv)
        private virtualEnvRepository: Repository<VirtualEnv>,
        @Inject(MicroInfraApiService)
        private microInfraApiService: MicroInfraApiService,
        @InjectRepository(VirtualEnvService)
        private virtualEnvServiceRepository: Repository<VirtualEnvService>,
        @InjectRepository(MicroInfraService)
        private microInfraServiceRepository: Repository<MicroInfraService>,
    ) {
    }

    create = async (data: CreateVirtualEnvDto) => {

        const servicesEntities = await this.microInfraServiceRepository.find();
        //const services = await microInfraService.getAllServices();
        const services = servicesEntities.map(srv => {
            return srv.name
        })

        // console.log('availableServices', services)
        // const rules = {
        //     title: 'string|min:6',
        // };
        //
        // const validateResult = validate(rules, req.body);
        //
        // if (validateResult !== true) {
        //     throw createHttpError(422, validateResult?.[0]?.message);
        // }

        const virtualEnv = new VirtualEnv();

        virtualEnv.title = data.title;
        virtualEnv.description = data.description;
        //virtualEnv.owner = req.body.owner;
        virtualEnv.user_id = 1 || null
        //const githubTagByServiceName = data?.githubTagByServiceName;
        let githubTagByServiceName = []

        if (data?.virtualEnvServices) {
            data?.virtualEnvServices.forEach(v => {
                githubTagByServiceName[v.service_name] = v.service_github_tag
            })
        }

        let availableServices = [];
        services.forEach(serviceName => {
            availableServices.push(VirtualEnvService.create({
                service_name: serviceName,
                service_header: this.microInfraApiService.createServiceHeader(serviceName),
                service_header_value: virtualEnv.title,
                service_github_tag: githubTagByServiceName?.[serviceName]
            }))
        });

        virtualEnv.virtualEnvServices = availableServices;

        const result = await this.virtualEnvRepository.save(virtualEnv);
        return result;
        //const q = new CreateVirtualEnvQueue().addVirtualEnvQueue(result.id)
        //return  res.json({ code: 'ok', data: result });
    }

    update = async (id: string, data: CreateVirtualEnvDto) => {

        const virtualEnv = await this.virtualEnvRepository.findOne({
            where: {id: id},
            relations: ['virtualEnvServices', 'user'],
        });

        if (!virtualEnv) {
            throw new NotFoundException(`Virtual env with ID:${id} not found.`)
        }

        virtualEnv.title = data.title || virtualEnv.title
        virtualEnv.status = VirtualEnvStatus.WAIT_PR

        virtualEnv.virtualEnvServices.map(item => {
            const newValue = _.find(data.virtualEnvServices, ['id', item.id])
            if (newValue) {
                const tag = Object.prototype.hasOwnProperty.call(newValue, 'service_github_tag')
                    ? newValue.service_github_tag
                    : item.service_github_tag;
                console.log('!!!.tag', tag);
                item.service_github_tag = tag;
                item.is_enable = newValue.is_enable || item.is_enable
            }
        });

        //WsClient.send({ id: virtualEnv.id, data:virtualEnv });
        // console.log(virtualEnv.virtualEnvServices, req.body.virtualEnvServices)
        //virtualEnv.virtualEnvServices = [...req.body.virtualEnvServices || [], ...virtualEnv.virtualEnvServices]

        const result = await this.virtualEnvRepository.save(virtualEnv);
        // const q = new UpdateVirtualEnvQueue().updateVirtualEnvQueue(result.id)
        // const msg = new SendWsQueue().send({
        //     data: virtualEnv,
        //     type: MessageTypes.updateVirtualEnv
        //
        // })
        return result
    }

    delete = async (id: string) => {

        const virtualEnv = await this.virtualEnvRepository.findOne({
            where: {id: id}
        });

        if (!virtualEnv) {
            throw new NotFoundException(`Virtual env with ID:${id} not found.`)
        }

        virtualEnv.status = VirtualEnvStatus.WAIT_DELETE
        const result = await this.virtualEnvRepository.save(virtualEnv);
        //const q = new DeleteVirtualEnvQueue().deleteVirtualEnvQueue(result.id)
        // await virtualEnvRepository.delete({
        //     id: req.params.id
        // })
        return result


    }

    findAll = async (search?: string, limit?: number, offset?: number) => {

        const take = limit || 10;
        const skip = offset || 0;

        const [data, count] = await this.virtualEnvRepository.findAndCount({
            cache: false,
            skip: skip * take,
            take: take,
            order: {
                id: "DESC"
            },
            relations: ['virtualEnvServices', 'user'],

        });

        const totalPages = Math.ceil(count / take)
        const currentPage = Math.ceil(count % take)

        return {
            total: count,
            count: data.length,
            pages: totalPages,
            currentPage: currentPage,
            data: data
        }
    }

    findById = async (id: number) => {
        const virtualEnv = await this.virtualEnvRepository.findOne({
            where: {id: id},
            relations: ['virtualEnvServices', 'user'],
        });

        if (!virtualEnv) {
            throw new NotFoundException(`Virtual env with ID:${id} not found.`)
        }

        return virtualEnv
    }
}
