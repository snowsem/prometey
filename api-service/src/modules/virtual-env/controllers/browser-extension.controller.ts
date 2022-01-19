import {Controller, Get, Inject} from "@nestjs/common";
import {VenvService} from "../services/venv.service";
import {ApiOkResponse, ApiTags} from "@nestjs/swagger";
import { VirtualEnv } from '../entity/virtual-env.entity';

@Controller('browser-extension')
@ApiTags('browser-extension')
export class BrowserExtensionController {

    constructor(
        @Inject(VenvService) private venvService:VenvService
    ) {}

    @Get('get-data')
    @ApiOkResponse({type: [VirtualEnv]})
    public getData() {
        return this.venvService.getVirtualEnvsAndHeaders()
    }
}