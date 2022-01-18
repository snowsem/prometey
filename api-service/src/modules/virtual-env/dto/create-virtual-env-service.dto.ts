import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVirtualEnvServiceDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  service_name: string;
  @IsString()
  @ApiProperty()
  service_github_tag?: string;
}
