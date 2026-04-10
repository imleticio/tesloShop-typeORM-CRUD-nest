import { Controller, Get, Post, Body, UseGuards, Request, Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto , LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities';
import { GetRawHeader } from './decorators/get-rawHeader.decorator';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { validRoles } from './interfaces';
import { Auth } from './decorators';

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
    @Headers() headers:IncomingHttpHeaders
  ){
    
    return{
      ok:true,
      message:'Hola mundo',
      user,
      userEmail,
      rawHeader,
      headers
    }



    
  }

  @Get('private2')
  @RoleProtected(validRoles.superUser, validRoles.admin)
  // @SetMetadata('roles',['admin','super-user'])
  @UseGuards(AuthGuard('jwt'),UserRoleGuard)
  privateRoute2(
    @GetUser() user : User
  ){

    return {
    ok:true,
    user

  }


  }
   @Get('private3')
   @Auth(validRoles.admin)

  privateRoute3(
    @GetUser() user : User
  ){

    return {
    ok:true,
    user

  }


  }

  


}
