import {ApiProperty} from "@nestjs/swagger";
import {User} from "../entity/user.entity";

export class GoogleAuthType {
    @ApiProperty({ type: User })
    user: User;

    @ApiProperty()
    token: string;
}
