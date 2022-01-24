import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CreateVirtualEnvServiceDto } from './create-virtual-env-service.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVirtualEnvDto {

  @ApiProperty()
  title: string;
  @ApiProperty()
  description?: string;
  @ApiProperty()
  githubTagByServiceName?: any;
  @ApiProperty()
  virtualEnvServices?: CreateVirtualEnvServiceDto[];
}
