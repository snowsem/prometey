import { Request, Response } from 'express';
import { AppLogger } from '../logger';
import {getRepository} from "typeorm";
import {VirtualEnv} from "../entity/VirtualEnv";
import {validate} from "../validators";

export interface IVirtualEnvPayload {
    title: string;
    owner: string;
    description: string;
}

class VirtualEnvController {

    async index(req: Request, res: Response) {
        const virtualEnvRepository = getRepository(VirtualEnv);
        const virtualEnvCollection = await virtualEnvRepository.find();
        return res.json({ code: 'ok', data: virtualEnvCollection });
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
}

export default new VirtualEnvController();