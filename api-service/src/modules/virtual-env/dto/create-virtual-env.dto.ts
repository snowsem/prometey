import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CreateVirtualEnvServiceDto } from './create-virtual-env-service.dto';

export class CreateVirtualEnvDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  description?: string;
  githubTagByServiceName?: any;
  virtualEnvServices?: CreateVirtualEnvServiceDto[];
}
