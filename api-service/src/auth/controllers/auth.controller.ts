import {Body, Controller, Get, Inject, Post, UseGuards} from '@nestjs/common';
import {AuthService} from "../auth.service";
import {AuthUserByGooglePayloadDto} from "../dto/auth-user-by-google-payload.dto";
import {JwtAuthGuard} from "../jwt-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(
        @Inject(AuthService) private authService
    ) {}

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    public getMe(){
        return this.authService.me();
    }

    @Post('/google')
    public authenticateUserByGoogle(@Body() req: AuthUserByGooglePayloadDto) {
        return this.authService.authenticateUserByGoogle(req.token)
    }
}
