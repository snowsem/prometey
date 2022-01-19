import {Body, Controller, Get, Inject, Post, UseGuards,} from '@nestjs/common';
import {AuthService} from '../auth.service';
import {AuthUserByGooglePayloadDto} from '../dto/auth-user-by-google-payload.dto';
import {JwtAuthGuard} from '../jwt-auth.guard';
import {CurrentUser} from '../current-user.decorator';
import {ApiBearerAuth, ApiOkResponse, ApiSecurity, ApiTags,} from '@nestjs/swagger';
import {User} from '../entity/user.entity';
import {SendMessageWsProcessor} from "../../websocket/processors/send-message-ws.processor";
import {GoogleAuthType} from "../types/google-auth.type";

@Controller('auth')
@ApiTags('auth')
@ApiSecurity('Bearer')
export class AuthController {
  constructor(
      @Inject(AuthService) private authService: AuthService,
  ) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Bearer')
  @ApiOkResponse({ type: User })
  public getMe(@CurrentUser() user) {
    return this.authService.findOneById(user.id);
  }

  @Post('/google')
  @ApiOkResponse({type: GoogleAuthType})
  public authenticateUserByGoogle(@Body() req: AuthUserByGooglePayloadDto) {
    return this.authService.authenticateUserByGoogle(req.token);
  }
}
