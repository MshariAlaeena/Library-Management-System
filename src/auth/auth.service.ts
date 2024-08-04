import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // async signIn(username: string, password:string): Promise<{ accessToken: string }> {
  //     const user = await this.userService.findUser(username);

  //     if (!user) {
  //         throw new UnauthorizedException('Invalid credentials');
  //     }

  //     const isMatch = await bcrypt.compare(password, user.password);

  //     if(!isMatch) {
  //         throw new UnauthorizedException('Invalid credentials');
  //     }

  //     const payload = { id: user.id, username: user.username, role: user.role};

  //     return { accessToken: await this.jwtService.signAsync(payload) };
  // }

  async signIn(
    username: string,
    password: string,
  ): Promise<{ token: string; expiry: number }> {
    const user = await this.userService.findUser(username);
    console.log('Found user:', user);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials - user not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      throw new UnauthorizedException(
        'Invalid credentials - password mismatch',
      );
    }

    const payload = { id: user.id, username: user.username, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    const expiry = 3600; //3600 second (1h, really ? yes)

    return { token, expiry };
  }

  async signup(
    username: string = 'john',
    password: string = 'test',
    role: string = 'arole',
  ) {
    const john = await this.userService.createUser('john', 'changeme', 'admin');
    const joe = await this.userService.createUser('joe', 'changeme', 'user');
  }
}
