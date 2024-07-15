import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ){}
   
    async findUser(username: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { username }});
    }

    async createUser(username: string, password: string, role: string): Promise<User> {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = this.usersRepository.create({ username, password: hashedPassword, role });
      return await this.usersRepository.save(user);
    }
}
