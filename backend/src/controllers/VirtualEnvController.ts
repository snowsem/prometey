import { Request, Response } from 'express';
import { AppLogger } from '../logger';
import {getConnection, getRepository} from "typeorm";
import {VirtualEnv} from "../entity/VirtualEnv";
import {validate} from "../validators";
import {MicroInfraService} from "../services/MicroInfraService";
import {VirtualEnvService} from "../entity/VirtualEnvService";
import {_} from 'lodash'

export interface IVirtualEnvPayload {
    title: string;
    owner: string;
    description: string;
}

class VirtualEnvController {

    async index(req: Request, res: Response) {
        const limit = req.query.limit ? parseInt(<string>req.query.limit) : 10;
        const offset = req.query.offset ? parseInt(<string>req.query.offset) : 0;

        const virtualEnvRepository = getRepository(VirtualEnv);
        const [data, count] = await virtualEnvRepository.findAndCount({
            cache:false,
            skip: offset * limit,
            take: limit,
            order: {
                id: "DESC"
            },
            relations: ['virtualEnvServices'],

        });

        const totalPages = Math.ceil(count / limit)
        const currentPage = Math.ceil(count % limit)

        return res.json({ code: 'ok',
            total: count,
            count: data.length,
            pages: totalPages,
            currentPage: currentPage,
            data: data
        });
    }

    async create(req: Request, res: Response) {
        try {
            const microInfraService = new MicroInfraService(process.env.GITHUB_API_TOKEN);
            const services = await microInfraService.getAllServices()

            console.log('availableServices')
            const rules = {
                title: 'string|min:6',
            };

            const validateResult = validate(rules, req.body);

            if (validateResult !== true) {
               return res.json({ code: 'validation', msg: validateResult });
            }

            const virtualEnvRepository = getRepository(VirtualEnv);
            const virtualEnv = new VirtualEnv();

            virtualEnv.title = req.body.title;
            virtualEnv.description = req.body.description;
            virtualEnv.owner = req.body.owner;


            let availableServices = []
            services.forEach(item=>{
                availableServices.push(VirtualEnvService.create({
                    service_name: item,
                    service_header: microInfraService.createServiceHeader(item),
                    service_header_value: virtualEnv.title

                }))
            });

            virtualEnv.virtualEnvServices = availableServices

            const result = await virtualEnvRepository.save(virtualEnv);
            return  res.json({ code: 'ok', data: result });
        } catch (e) {
            //const availableServices = await this.microInfraService.getAllServices()
            console.log(e)
            res.json(e)
        }
    }

    async show(req: Request, res: Response) {
        const virtualEnvRepository = getRepository(VirtualEnv)
        const virtualEnv = await virtualEnvRepository.findOne({
            where: {id:req.params.id},
            relations: ['virtualEnvServices'],
        });


        if (!virtualEnv) {
            return  res.json({ code: 'error', msg: 'Entity not found' });
        }

        return  res.json({ code: 'ok', data: virtualEnv });
    }

    async delete(req: Request, res: Response, next) {
        const virtualEnvRepository = getRepository(VirtualEnv)
        try {
            await virtualEnvRepository.delete({
                id: req.params.id
            })
            res.sendStatus(204);
        } catch (e) {
            next(e);
        }

    }

    async update(req: Request, res: Response) {
        const rules = {
            title: 'string|min:6',
        };

        const validateResult = validate(rules, req.body);

        if (validateResult !== true) {
            return res.json({ code: 'validation', msg: validateResult });
        }

        const virtualEnvRepository = getRepository(VirtualEnv)
        const virtualEnv = await virtualEnvRepository.findOne({
            where: {id:req.params.id},
            relations: ['virtualEnvServices'],
        });

        if (!virtualEnv) {
            return  res.json({ code: 'error', msg: 'Entity not found' });
        }

        virtualEnv.title = req.body.title || virtualEnv.title
        virtualEnv.virtualEnvServices.map(item=>{
            const newValue = _.find(req.body.virtualEnvServices, ['id', item.id])
            if (newValue) {
                item.service_github_tag = newValue.service_github_tag || item.service_github_tag
                item.is_enable = newValue.is_enable || item.is_enable
            }
        });

        console.log(virtualEnv.virtualEnvServices, req.body.virtualEnvServices)
        //virtualEnv.virtualEnvServices = [...req.body.virtualEnvServices || [], ...virtualEnv.virtualEnvServices]

        const result = await virtualEnvRepository.save(virtualEnv);
        return  res.json({ code: 'ok', data: result });

    }
}

export default new VirtualEnvController();
