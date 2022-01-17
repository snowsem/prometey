import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateVirtualEnvServiceDto {
  @IsNotEmpty()
  @IsString()
  service_name: string;
  @IsString()
  service_github_tag?: string;
}
