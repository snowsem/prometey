import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  Delete,
  HttpCode,
  Patch, UseGuards,
} from '@nestjs/common';
import { VenvService } from '../services/venv.service';
import { PaginationParams } from '../../../types/PaginationParams';
import { CreateVirtualEnvDto } from '../dto/create-virtual-env.dto';
import { MicroInfraApiService } from '../../github/services/micro-infra-api.service';
import {JwtAuthGuard} from "../../../auth/jwt-auth.guard";

@Controller('virtual-env')
export class VirtualEnvController {
  constructor(
    private readonly virtualEnvService: VenvService,
    private git: MicroInfraApiService,
  ) {}

  @Get('/ad')
  public a() {
    return this.git.getAllServices();
  }

  @Get('/get-services')
  @UseGuards(JwtAuthGuard)
  public getServices() {
    return this.virtualEnvService.getAvailableService()
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  public index(
    @Query('search') search: string,
    @Query() { offset, limit }: PaginationParams,
  ) {
    return this.virtualEnvService.findAll(search, limit, offset);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public show(@Param('id') id: string) {
    return this.virtualEnvService.findById(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  public update(@Param('id') id, @Body() virtualEnv: CreateVirtualEnvDto) {
    return this.virtualEnvService.update(id, virtualEnv);
  }

}
