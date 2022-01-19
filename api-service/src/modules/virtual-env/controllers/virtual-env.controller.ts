import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  Delete,
  HttpCode,
  Patch,
  UseGuards, Inject,
} from '@nestjs/common';
import { VenvService } from '../services/venv.service';
import { PaginationParams } from '../../../types/PaginationParams';
import { CreateVirtualEnvDto } from '../dto/create-virtual-env.dto';
import { MicroInfraApiService } from '../../github/services/micro-infra-api.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {VirtualEnvListType} from '../../../types/virtual-env-list.type'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { MicroInfraService } from '../entity/micro-infra-service.entity';
import { VirtualEnv } from '../entity/virtual-env.entity';

@Controller('virtual-env')
@ApiTags('virtual-env')
@ApiSecurity('Bearer')
export class VirtualEnvController {
  constructor(
      @Inject(VenvService)
      private readonly virtualEnvService: VenvService,
  ) {}

  @Get('/get-services')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [MicroInfraService] })
  @ApiBearerAuth('JWT-auth')
  public getServices() {
    return this.virtualEnvService.getAvailableService();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [VirtualEnvListType] })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'search', required: false })
  public index(
    @Query('search') search: string,
    @Query() { offset, limit }: PaginationParams,
  ) {
    return this.virtualEnvService.findAll(search, limit, offset);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: VirtualEnv })
  public show(@Param('id') id: string) {
    return this.virtualEnvService.findById(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: VirtualEnv })
  public create(@Body() virtualEnv: CreateVirtualEnvDto) {
    return this.virtualEnvService.create(virtualEnv);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  public delete(@Param('id') id: string) {
    return this.virtualEnvService.delete(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: VirtualEnv })
  @UseGuards(JwtAuthGuard)
  public update(@Param('id') id, @Body() virtualEnv: CreateVirtualEnvDto) {
    return this.virtualEnvService.update(id, virtualEnv);
  }
}
