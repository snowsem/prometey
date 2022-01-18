import {Controller, Get, Inject, Post} from '@nestjs/common';
import {AuthService} from "../auth.service";

@Controller('auth')
export class AuthController {
    constructor(
        @Inject(AuthService) private authService
    ) {}

    @Get('/me')
    public getMe(){
        return this.authService.me();
    }

    @Post('/google')
    public authenticateUserByGoogle() {

    }
}
