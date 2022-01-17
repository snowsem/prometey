import { Injectable } from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from '@nestjs/typeorm';
import {VirtualEnv} from "./entity/virtual-env.entity";

@Injectable()
export class VirtualEnvService {

    constructor(
        @InjectRepository(VirtualEnv)
        private virtualEnvRepository: Repository<VirtualEnv>
    ) {}

    create = ()=> {

    }

    findAll = ()=> {
        return this.virtualEnvRepository.find({
            order: {
                id: "DESC"
            },
            relations: ['virtualEnvServices'],
        })
    }

    findOne = ()=> {

    }

}
