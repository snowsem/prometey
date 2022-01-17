import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from '@nestjs/typeorm';
import {CreateVirtualEnvDto} from "../dto/create-virtual-env.dto";
import {MicroInfraApiService} from "../../github/services/micro-infra-api.service";
import {VirtualEnv} from "../entity/virtual-env.entity";
import {VirtualEnvService} from "../entity/virtual-env-service.entity";
import {MicroInfraService} from "../entity/micro-infra-service.entity";


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
    ) {}

    create = async (data: CreateVirtualEnvDto)=> {

        const servicesEntities = await this.microInfraServiceRepository.find();
        //const services = await microInfraService.getAllServices();
        const services = servicesEntities.map(srv=>{
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
            data?.virtualEnvServices.forEach(v=>{
                githubTagByServiceName[v.service_name] = v.service_github_tag
            })
        }

        let availableServices = [];
        services.forEach(serviceName=>{
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

    findAll = async (search?: string, limit?: number, offset?: number)=> {

        const take = limit || 10;
        const skip = offset || 0;

        const [data, count] = await this.virtualEnvRepository.findAndCount({
            cache:false,
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

    findById = async (id: number) =>{
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
