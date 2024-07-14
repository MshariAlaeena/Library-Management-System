import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
const saltRounds = 12;

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) {}

    async signIn(username: string, pass:string): Promise<{accessToken: string}> {
        const user = await this.userService.findUser(username);
        const hashedPassword = await bcrypt.hash(pass, saltRounds)

        const isMatch = await bcrypt.compare(pass, hashedPassword);
        
        if(!isMatch) 
            throw new UnauthorizedException();

        const payload = { id: user.id, username: user.username}
        
        return { accessToken: await this.jwtService.signAsync(payload)};
    }
}
