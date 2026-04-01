import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { User } from './entities';
import * as bcrypt  from 'bcrypt';



@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto) {

    try {
      const {password, ...userDate} = createUserDto

      const user = this.userRepository.create({
        ...userDate,
        password:bcrypt.hashSync(password, 10)
      })
      await this.userRepository.save(user)
      delete user.password

      return user;

    } catch (error) {

      this.handleDBError(error)
    }


  }

  private handleDBError(error: any):never {
    if (error.code = '23505')
      throw new BadRequestException(error.detail);

    console.log(error)

    throw new InternalServerErrorException('please check server logs')

  }


}
