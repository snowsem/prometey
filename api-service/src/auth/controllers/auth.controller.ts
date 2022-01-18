import {Body, Controller, Get, Inject, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from "../auth.service";
import {AuthUserByGooglePayloadDto} from "../dto/auth-user-by-google-payload.dto";
import {JwtAuthGuard} from "../jwt-auth.guard";
import {CurrentUser} from "../current-user.decorator";

@Controller('auth')
export class AuthController {
    constructor(
        @Inject(AuthService) private authService
    ) {}

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    public getMe(@CurrentUser() user){
        return this.authService.findById(user.id)
    }

    @Post('/google')
    public authenticateUserByGoogle(@Body() req: AuthUserByGooglePayloadDto) {
        return this.authService.authenticateUserByGoogle(req.token)
    }
}
