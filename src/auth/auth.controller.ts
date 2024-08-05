import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('auth/signIn')
  async signIn(
    @Body() signInDto: SignInDto,
  ): Promise<{ token: string; expiry: number }> {
    const { token, expiry } = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
    return { token, expiry };
  }

  @Post('auth/signUp')
  async signUp() {
    await this.authService.signup();
    return 'user created';
  }
}
