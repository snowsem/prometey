import { Controller } from '@nestjs/common';
import {VirtualEnvService} from "./virtual-env.service";

@Controller('virtual-env')
export class VirtualEnvController {
    constructor(private readonly virtualEnvService: VirtualEnvService) {
    }
}
