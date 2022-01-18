import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entity/user.entity";
import {Repository} from "typeorm";
import { OAuth2Client } from "google-auth-library";

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

    findOneById = (id: string)=>{
        return this.userRepository.findOne({
            where: {
                id: id
            }
        })
    }

    authenticateUserByGoogle = async ()=>{
        // const googleClient = new OAuth2Client({
        //     clientId: `${process.env.GOOGLE_CLIENT_ID}`,
        // });
        //
        // const { token } = req.body;
        //
        // const ticket = await googleClient.verifyIdToken({
        //     idToken: token,
        //     audience: `${process.env.GOOGLE_CLIENT_ID}`,
        //     audient: `${process.env.GOOGLE_CLIENT_ID}`,
        // });
        //
        // const userRepo = getRepository(User);
        //
        // const payload = ticket.getPayload();
        //
        // let user = await User.findOne({ email: payload?.email });
        //
        // const _token = jwt.sign(
        //     { user_id: user.id, user_email: user.email, token_google: token },
        //     process.env.TOKEN_KEY,
        //     {
        //         expiresIn: "30d",
        //     }
        // );
        //
        // if (!user) {
        //     user = new User()
        //     user.email = payload?.email
        //     user.avatar = payload?.picture
        //     user.first_name = payload?.name
        //     user.token_google = token
        //     user.token = _token;
        //
        //     await userRepo.save(user);
        // }
    }

    me = async ()=>{
        const u = await this.userRepository.find()
        return u
    }
}
