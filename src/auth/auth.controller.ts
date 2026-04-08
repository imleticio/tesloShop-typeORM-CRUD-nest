import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto , LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities';
import { GetRawHeader } from './decorators/get-rawHeader.decorator';
import { IncomingHttpHeaders } from 'http';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }


  @Get('private')
  @UseGuards(AuthGuard('jwt'))
  testigPrivateRoute(
    @Request() request: Express.Request,
    @GetUser() user:User,
    @GetUser('email') userEmail:string,
    @GetRawHeader() rawHeader:string[],
    // @Headers() header:IncomingHttpHeaders
  ){
    // console.log({user:request.user})
    // console.log(request)
    return{
      ok:true,
      message:'Hola mundo',
      user,
      userEmail,
      rawHeader,
      // header
    }
  }


}
