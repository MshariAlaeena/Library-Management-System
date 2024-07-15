import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
    let authService: AuthService;
    let userService: UserService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: {
                        findUser: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn(),
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should return access token for valid credentials', async () => {
        const username = 'john';
        const password = 'changeme';
        const hashedPassword = await bcrypt.hash(password, 10);
        
        jest.spyOn(userService, 'findUser').mockResolvedValue({ id: 1, username, password: hashedPassword, role: 'admin' });
        jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
        jest.spyOn(jwtService, 'signAsync').mockImplementation(async () => 'mockAccessToken');

        const result = await authService.signIn(username, password);
        expect(result).toEqual({ accessToken: 'mockAccessToken' });
    });

    it('should throw UnauthorizedException for invalid username', async () => {
        const username = 'invalidUser';
        const password = 'changeme';

        jest.spyOn(userService, 'findUser').mockResolvedValue(null);

        await expect(authService.signIn(username, password)).rejects.toThrow(new UnauthorizedException('Invalid credentials - user not found'));
    });

    it('should throw UnauthorizedException for invalid password', async () => {
        const username = 'john';
        const password = 'wrongpassword';
        const hashedPassword = await bcrypt.hash('changeme', 10);

        jest.spyOn(userService, 'findUser').mockResolvedValue({ id: 1, username, password: hashedPassword, role: 'admin' });
        jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

        await expect(authService.signIn(username, password)).rejects.toThrow(new UnauthorizedException('Invalid credentials - password mismatch'));
    });
});
