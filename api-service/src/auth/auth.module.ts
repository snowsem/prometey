import {Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './controllers/auth.controller';
import {User} from "./entity/user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([
    User
  ])],
  exports: [AuthService],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
