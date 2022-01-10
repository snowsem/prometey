import {Request, Response} from 'express';
import {getRepository} from "typeorm";
import {VirtualEnv, VirtualEnvStatus} from "../entity/VirtualEnv";
import {validate} from "../validators";
import {MicroInfraService} from "../services/MicroInfraService";
import {VirtualEnvService} from "../entity/VirtualEnvService";
import {_} from 'lodash'
import createHttpError from 'http-errors';
import {MessageTypes, WsClient} from "../ws/client";
import {CreateVirtualEnvQueue} from "../jobs/CreateVirtualEnvQueue";
import {DeleteVirtualEnvQueue} from "../jobs/DeleteVirtualEnvQueue";


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

    async create(req: Request, res: Response, next) {
        try {
            const microInfraService = new MicroInfraService(process.env.GITHUB_API_TOKEN);
            const services = await microInfraService.getAllServices();

            console.log('availableServices')
            const rules = {
                title: 'string|min:6',
            };

            const validateResult = validate(rules, req.body);

            if (validateResult !== true) {
                throw createHttpError(422, validateResult?.[0]?.message);
            }

            const virtualEnvRepository = getRepository(VirtualEnv);
            const virtualEnv = new VirtualEnv();

            virtualEnv.title = req.body.title;
            virtualEnv.description = req.body.description;
            virtualEnv.owner = req.body.owner;
            const githubTagByServiceName = req.body?.githubTagByServiceName;

            let availableServices = [];
            services.forEach(serviceName=>{
                availableServices.push(VirtualEnvService.create({
                    service_name: serviceName,
                    service_header: microInfraService.createServiceHeader(serviceName),
                    service_header_value: virtualEnv.title,
                    service_github_tag: githubTagByServiceName?.[serviceName]
                }))
            });

            virtualEnv.virtualEnvServices = availableServices;

            const result = await virtualEnvRepository.save(virtualEnv);
            const q = new CreateVirtualEnvQueue().addVirtualEnvQueue(result.id)
            return  res.json({ code: 'ok', data: result });
        } catch (e) {
            next(e);
        }
    }

    async show(req: Request, res: Response) {
        const virtualEnvRepository = getRepository(VirtualEnv);
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

        try {
            const virtualEnvRepository = getRepository(VirtualEnv);
            const virtualEnv = await virtualEnvRepository.findOne({
                where: {id:req.params.id}
            });
            virtualEnv.status = VirtualEnvStatus.WAIT_DELETE
            const result = await virtualEnvRepository.save(virtualEnv);
            const q = new DeleteVirtualEnvQueue().deleteVirtualEnvQueue(result.id)
            // await virtualEnvRepository.delete({
            //     id: req.params.id
            // })
            res.sendStatus(204);
        } catch (e) {
            next(e);
        }

    }

    async update(req: Request, res: Response, next) {
        try {
            const rules = {
                title: { type: "string", min: 6, optional: true },
            };

            const validateResult = validate(rules, req.body);

            if (validateResult !== true) {
                throw createHttpError(422, validateResult?.[0]?.message);
            }

            const virtualEnvRepository = getRepository(VirtualEnv)
            const virtualEnv = await virtualEnvRepository.findOne({
                where: {id: req.params.id},
                relations: ['virtualEnvServices'],
            });

            if (!virtualEnv) {
                if (validateResult !== true) {
                    throw createHttpError(404);
                }
            }

            virtualEnv.title = req.body.title || virtualEnv.title
            virtualEnv.status = VirtualEnvStatus.WAIT_PR
            virtualEnv.virtualEnvServices.map(item => {
                const newValue = _.find(req.body.virtualEnvServices, ['id', item.id])
                if (newValue) {
                    item.service_github_tag = newValue.service_github_tag || item.service_github_tag
                    item.is_enable = newValue.is_enable || item.is_enable
                }
            });

            //WsClient.send({ id: virtualEnv.id, data:virtualEnv });
            console.log(virtualEnv.virtualEnvServices, req.body.virtualEnvServices)
            //virtualEnv.virtualEnvServices = [...req.body.virtualEnvServices || [], ...virtualEnv.virtualEnvServices]

            const result = await virtualEnvRepository.save(virtualEnv);
            const ws = new WsClient();
            await ws.sendMessage({
                data: virtualEnv,
                type: MessageTypes.updateVirtualEnv
            })
            ws.close();
            return res.json({code: 'ok', data: result});
        } catch(e) {
            next(e);
        }

    }
}

export default new VirtualEnvController();
