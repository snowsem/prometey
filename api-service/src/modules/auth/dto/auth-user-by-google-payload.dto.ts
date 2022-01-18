import { IsNotEmpty } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

@Injectable()
export class AuthUserByGooglePayloadDto {
  @IsNotEmpty()
  @ApiProperty()
  token: string;
}
