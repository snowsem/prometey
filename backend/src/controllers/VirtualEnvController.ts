import { Request, Response } from 'express';
import { AppLogger } from '../logger';
import {getRepository} from "typeorm";
import {VirtualEnv} from "../entity/VirtualEnv";
import {validate} from "../validators";
import {MicroInfraService} from "../services/MicroInfraService";

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

    async getAvailableService(req: Request, res: Response) {
        const microInfraService = new MicroInfraService(process.env.GITHUB_API_TOKEN);
        const services = await microInfraService.getAllServices()
        return res.json({ code: 'ok', data: services });
        //console.log(services)
        //console.log(microInfraService.headersDecorator(services))
        //console.log(await microInfraService.getServiceValue('slates'))
    }

    async create(req: Request, res: Response) {
        try {
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

            const result = await virtualEnvRepository.save(virtualEnv);

            return  res.json({ code: 'ok', data: result });
        } catch (e) {
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

    async delete(req: Request, res: Response) {
        const virtualEnvRepository = getRepository(VirtualEnv)
        const virtualEnv = await virtualEnvRepository.delete({
            id: req.params.id
        })

        return  res.json({ code: 'ok', data: [] });
    }
}

export default new VirtualEnvController();