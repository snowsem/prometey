import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { OAuth2Client } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import {GoogleAuthType} from "./types/google-auth.type";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  findOneById = (id: string) => {
    return this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  };

  findOneByEmail = (email: string) => {
    return this.userRepository.findOne({
      where: {
        user_email: email,
      },
    });
  };

  authenticateUserByGoogle = async (token: string) => {
    const googleClient = new OAuth2Client({
      clientId: `${process.env.GOOGLE_CLIENT_ID}`,
    });

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: `${process.env.GOOGLE_CLIENT_ID}`,
      // @ts-ignore
      audient: `${process.env.GOOGLE_CLIENT_ID}`,
    });

    if (!ticket) {
      throw new UnauthorizedException('Cant auth by Google oauth');
    }


    // @ts-ignore
    const payload = ticket.getPayload();
    if (
        payload.email.endsWith('@pdffiller.team') ||
        payload.email.endsWith('@pdffiller.com') ||
        payload.email.endsWith('@spbfiller.com') ||
        payload.email.endsWith('@airslate.com'))
    {
      let user = await User.findOne({ email: payload?.email });

      if (!user) {
        user = new User();
        user.email = payload?.email;
        user.avatar = payload?.picture;
        user.first_name = payload?.given_name;
        user.last_name = payload?.family_name;
        user.token_google = token;
        user = await this.userRepository.save(user);
      }

      const _token = this.jwtService.sign({ email: user.email, id: user.id });
      return { user: user, token: _token };
    } else {
      throw new UnauthorizedException(`Only AirSlate teams can auth by Google ${payload.email}`);
    }
  };

  async login(user: any) {
    const payload = { email: user.email, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  me = async () => {
    const u = await this.userRepository.find();
    return u;
  };
}
