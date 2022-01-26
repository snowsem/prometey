import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {Like, Repository} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVirtualEnvDto } from '../dto/create-virtual-env.dto';
import { MicroInfraApiService } from '../../github/services/micro-infra-api.service';
import { VirtualEnv, VirtualEnvStatus } from '../entity/virtual-env.entity';
import { VirtualEnvService } from '../entity/virtual-env-service.entity';
import { MicroInfraService } from '../entity/micro-infra-service.entity';
import { _ } from 'lodash';
import { MicroInfraRepoService } from '../../github/services/micro-infra-repo.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateVirtualEnvProcessor } from '../processors/create-virtual-env.processor';
import {SendMessageWsProcessor} from "../../websocket/processors/send-message-ws.processor";
import {MessageTypes} from "../../websocket/websocket.client";
import {FindManyOptions} from "typeorm/find-options/FindManyOptions";

@Injectable()
export class VenvService {
  private readonly logger = new Logger(VenvService.name);

  constructor(
    @InjectRepository(VirtualEnv)
    private virtualEnvRepository: Repository<VirtualEnv>,
    @Inject(MicroInfraApiService)
    private microInfraApiService: MicroInfraApiService,
    @InjectRepository(VirtualEnvService)
    private virtualEnvServiceRepository: Repository<VirtualEnvService>,
    @InjectRepository(MicroInfraService)
    private microInfraServiceRepository: Repository<MicroInfraService>,
    @InjectQueue(CreateVirtualEnvProcessor.getQueueName())
    private virtualEnvQueue: Queue,
    @Inject(SendMessageWsProcessor)
    private sendMessageQueue:SendMessageWsProcessor,
  ) {}

  create = async (data: CreateVirtualEnvDto, user: any) => {
    const servicesEntities = await this.microInfraServiceRepository.find();
    //const services = await microInfraService.getAllServices();
    const services = servicesEntities.map((srv) => {
      return srv.name;
    });

    const virtualEnv = new VirtualEnv();

    virtualEnv.title = data.title.replace(' ','-');
    virtualEnv.description = data.description;
    //virtualEnv.owner = req.body.owner;
    virtualEnv.user_id = user.id;
    //const githubTagByServiceName = data?.githubTagByServiceName;
    const githubTagByServiceName = [];

    if (data?.virtualEnvServices) {
      data?.virtualEnvServices.forEach((v) => {
        githubTagByServiceName[v.service_name] = v.service_github_tag;
      });
    }

    const availableServices = [];
    services.forEach((serviceName) => {
      availableServices.push(
        VirtualEnvService.create({
          service_name: serviceName,
          service_header:
            this.microInfraApiService.createServiceHeader(serviceName),
          service_header_value: virtualEnv.title,
          service_github_tag: githubTagByServiceName?.[serviceName],
        }),
      );
    });

    virtualEnv.virtualEnvServices = availableServices;

    const result = await this.virtualEnvRepository.save(virtualEnv);
    await this.virtualEnvQueue.add('create', result.id);
    this.sendMessageQueue.sendBroadcast({
      data: virtualEnv,
      type: MessageTypes.updateVirtualEnv

    })
    return result;
    //const q = new CreateVirtualEnvQueue().addVirtualEnvQueue(result.id)
    //return  res.json({ code: 'ok', data: result });
  };

  update = async (id: string, data: CreateVirtualEnvDto) => {
    const virtualEnv = await this.virtualEnvRepository.findOne({
      where: { id: id },
      relations: ['virtualEnvServices', 'user'],
    });

    if (!virtualEnv) {
      throw new NotFoundException(`Virtual env with ID:${id} not found.`);
    }

    virtualEnv.title = data.title || virtualEnv.title;
    virtualEnv.status = VirtualEnvStatus.WAIT_PR;

    virtualEnv.virtualEnvServices.map((item) => {
      const newValue = _.find(data.virtualEnvServices, ['id', item.id]);
      if (newValue) {
        const tag = Object.prototype.hasOwnProperty.call(
          newValue,
          'service_github_tag',
        )
          ? newValue.service_github_tag
          : item.service_github_tag;
        console.log('!!!.tag', tag);
        item.service_github_tag = tag;
        item.is_enable = newValue.is_enable || item.is_enable;
      }
    });

    //WsClient.send({ id: virtualEnv.id, data:virtualEnv });
    // console.log(virtualEnv.virtualEnvServices, req.body.virtualEnvServices)
    //virtualEnv.virtualEnvServices = [...req.body.virtualEnvServices || [], ...virtualEnv.virtualEnvServices]

    const result = await this.virtualEnvRepository.save(virtualEnv);
    this.virtualEnvQueue.add('update', result.id);
    this.sendMessageQueue.sendBroadcast({
          data: virtualEnv,
          type: MessageTypes.updateVirtualEnv
    })

    // const q = new UpdateVirtualEnvQueue().updateVirtualEnvQueue(result.id)
    // const msg = new SendWsQueue().send({
    //     data: virtualEnv,
    //     type: MessageTypes.updateVirtualEnv
    //
    // })
    return result;
  };

  delete = async (id: string) => {
    const virtualEnv = await this.virtualEnvRepository.findOne({
      where: { id: id },
    });

    if (!virtualEnv) {
      throw new NotFoundException(`Virtual env with ID:${id} not found.`);
    }

    virtualEnv.status = VirtualEnvStatus.WAIT_DELETE;
    const result = await this.virtualEnvRepository.save(virtualEnv);
    this.sendMessageQueue.sendBroadcast({
      data: virtualEnv,
      type: MessageTypes.updateVirtualEnv
    })
    this.virtualEnvQueue.add('delete', result.id);

    //const q = new DeleteVirtualEnvQueue().deleteVirtualEnvQueue(result.id)
    // await virtualEnvRepository.delete({
    //     id: req.params.id
    // })
    return result;
  };

  deleteEntity = async (id: string)=> {
    const virtualEnv = await this.virtualEnvRepository.findOne({
      where: { id: id },
    });

    if (!virtualEnv) {
      throw new NotFoundException(`Virtual env with ID:${id} not found.`);
    }
    await this.virtualEnvRepository.remove(virtualEnv)

  }

  findAll = async (search?: string, limit?: number, offset?: number) => {
    const take = limit || 10;
    const skip = offset || 0;

    const options:FindManyOptions  = {
      cache: false,
      skip: skip * take,
      take: take,
      order: {
        id: 'DESC',
      },
      relations: ['virtualEnvServices', 'user'],
    }

    if (search) {
      options.where = {
        title: Like(`%${search}%`)
      }
    }

    const [data, count] = await this.virtualEnvRepository.findAndCount(options);

    const totalPages = Math.ceil(count / take);
    const currentPage = Math.ceil(count % take);

    return {
      total: count,
      count: data.length,
      pages: totalPages,
      currentPage: currentPage,
      data: data,
    };
  };

  findById = async (id: number) => {
    const virtualEnv = await this.virtualEnvRepository.findOne({
      where: { id: id },
      relations: ['virtualEnvServices', 'user'],
    });

    if (!virtualEnv) {
      throw new NotFoundException(`Virtual env with ID:${id} not found.`);
    }

    return virtualEnv;
  };

  importAllServices = async () => {
    this.logger.debug('Called when the current second is 45');

    const infraRepoService = new MicroInfraRepoService();
    await infraRepoService.getRepo(process.env.GITHUB_REPO_BRANCH);
    const gitServices = await infraRepoService.getAllServices();

    const valuesMap = gitServices.map((srv) => {
      return infraRepoService.getServiceDefaultValue(srv);
    });

    const values = await Promise.all(valuesMap);

    const serviceValues = values.map((v, i) => {
      return this.microInfraServiceRepository.create({
        name: gitServices[i],
        repository: v.image.repository,
        default_tag: v.image.tag,
      });
    });

    const result = await this.microInfraServiceRepository.save(serviceValues);
    return result;
  };

  async getAvailableService(limit?: number, offset?: number) {
    const take = limit || 100;
    const skip = offset || 0;

    const [data, count] = await this.microInfraServiceRepository.findAndCount({
      cache: false,
      skip: skip * take,
      take: take,
      order: {
        name: 'DESC',
      },
    });

    const totalPages = Math.ceil(count / take);
    const currentPage = Math.ceil(count % take);

    return {
      total: count,
      count: data.length,
      pages: totalPages,
      currentPage: currentPage,
      data: data,
    };
  }

  find = async (
    args?: object,
    search?: string,
    limit?: number,
    offset?: number,
  ) => {
    const take = limit || 100;
    const skip = offset || 0;

    const [data, count] = await this.virtualEnvRepository.findAndCount({
      ...args,
      cache: false,
      skip: skip * take,
      take: take,
    });

    const totalPages = Math.ceil(count / take);
    const currentPage = Math.ceil(count % take);

    return {
      total: count,
      count: data.length,
      pages: totalPages,
      currentPage: currentPage,
      data: data,
    };
  };

  getVirtualEnvsAndHeaders = async () => {
    const data = await this.virtualEnvRepository.find({
      cache: false,
      order: {
        id: 'DESC',
      },
      relations: ['virtualEnvServices', 'user'],
    });

    return data;
  };
}
