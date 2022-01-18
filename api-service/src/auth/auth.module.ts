import {Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './controllers/auth.controller';
import {User} from "./entity/user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PassportModule} from "@nestjs/passport";
import {JwtStrategy} from "./jwt.strategt";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forFeature([
    User
  ]), PassportModule,
    JwtModule.register({
      secret: process.env.JWTKEY,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
    }),
  ],
  exports: [AuthService],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
