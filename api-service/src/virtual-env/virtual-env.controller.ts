import {Controller, Get, Post} from '@nestjs/common';
import {VirtualEnvService} from "./virtual-env.service";

@Controller('virtual-env')
export class VirtualEnvController {
    constructor(private readonly virtualEnvService: VirtualEnvService) {
    }

    @Get()
    public index() {
        return this.virtualEnvService.findAll()
    }
}
