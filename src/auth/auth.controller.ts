import { Controller , Post, Body, HttpCode, HttpStatus} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('auth/login')
    async signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto.username, signInDto.pass);
    }
}
