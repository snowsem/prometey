import {VirtualEnv} from "../modules/virtual-env/entity/virtual-env.entity";
import {ApiProperty} from "@nestjs/swagger";

export class VirtualEnvListType {
    @ApiProperty()
    total: number;
    @ApiProperty()
    pages: number;
    @ApiProperty()
    count: number;
    @ApiProperty()
    currentPage: number
    @ApiProperty({ type: [VirtualEnv] })
    data: Array<VirtualEnv>[];
}
