import {Injectable, NotFoundException} from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from '@nestjs/typeorm';
import {VirtualEnv} from "../entity/virtual-env.entity";
import {CreateVirtualEnvDto} from "../dto/create-virtual-env.dto";

@Injectable()
export class VirtualEnvService {

    constructor(
        @InjectRepository(VirtualEnv)
        private virtualEnvRepository: Repository<VirtualEnv>
    ) {}

    create = (CreateVirtualEnvDto)=> {

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

    findOne = ()=> {

    }

}
