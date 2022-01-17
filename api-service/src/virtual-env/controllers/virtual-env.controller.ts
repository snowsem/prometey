import {Body, Controller, Get, Post, Query, Param} from '@nestjs/common';
import {VenvService} from "../services/venv.service";
import {PaginationParams} from "../../types/PaginationParams";
import {CreateVirtualEnvDto} from "../dto/create-virtual-env.dto";
import {MicroInfraApiService} from "../../github/services/micro-infra-api.service";

@Controller('virtual-env')
export class VirtualEnvController {
    constructor(
        private readonly virtualEnvService: VenvService,
        private git: MicroInfraApiService
    ) {
    }

    @Get('/ad')
    public a(){

        return this.git.getAllServices()
    }

    @Get()
    public index(
        @Query('search') search: string,
        @Query() { offset, limit }: PaginationParams
    )
    {
        return this.virtualEnvService.findAll(search, limit, offset)
    }

    @Get(':id')
    public show(
        @Param('id') id: string
    )
    {
        return this.virtualEnvService.findById(+id);
    }

    @Post()
    public create(
        @Body() virtualEnv: CreateVirtualEnvDto
    )
    {
        return this.virtualEnvService.create(virtualEnv);
    }
}
