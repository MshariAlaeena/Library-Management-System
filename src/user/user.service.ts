import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from "./user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ){}
   
    async findUser(username: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { username }});
    }

    async createUser(username: string, password: string): Promise<User> {
      const newUser = this.usersRepository.create({ username, password});
      await this.usersRepository.save(newUser);
      return newUser;
    }
}
