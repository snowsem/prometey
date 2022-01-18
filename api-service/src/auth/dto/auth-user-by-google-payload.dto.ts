import {IsNotEmpty} from "class-validator";
import {Injectable} from "@nestjs/common";

@Injectable()
export class AuthUserByGooglePayloadDto {
    @IsNotEmpty()
    token: string
}