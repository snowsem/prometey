import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entity/user.entity";
import {Repository} from "typeorm";


@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

    me = async ()=>{
        const u = await this.userRepository.find()
        return u
    }
}
