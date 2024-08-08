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

  async signIn(
    username: string,
    password: string,
  ): Promise<{ token: string; expiry: Date }> {
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

    const expiry = new Date(); // Current date and time
    expiry.setHours(expiry.getHours() + 1); // Add one hour to the current date and time


    return { token, expiry };
  }

  async signup() {
    const john = await this.userService.createUser('Mshari', 'changeme', 'admin');
    const joe = await this.userService.createUser('notMshari', 'changeme', 'user');
  }
}
