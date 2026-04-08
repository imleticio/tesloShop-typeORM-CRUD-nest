import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { User } from './entities';
import * as bcrypt  from 'bcrypt';
import { LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { runInThisContext } from 'node:vm';



@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService:JwtService
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

     return {
      ...user,
      token:this.getJwToken({email: user.email})
    }

    } catch (error) {

      this.handleDBError(error)
    }

  }

  async login(loginUserDto:LoginUserDto){
    
    const {password, email} = loginUserDto;
    const user = await this.userRepository.findOne({
      where: {email: email.toLocaleLowerCase()},
      select: {email:true, password: true , id:true}
    })
    if(!user)
        throw new UnauthorizedException('Credentials are not valid (email)')
    if(!bcrypt.compareSync(password , user.password))
        throw new UnauthorizedException('Credentials are not valid (password)')

    return {
      ...user,
      token:this.getJwToken({email: user.email})
    }

  }

  private getJwToken(payload: JwtPayload){
    //generar el token 

      const token = this.jwtService.sign(payload);
      return token;
  }


  private handleDBError(error: any):never {
    if (error.code = '23505')
      throw new BadRequestException(error.detail);

    console.log(error)

    throw new InternalServerErrorException('please check server logs')

  }


}
