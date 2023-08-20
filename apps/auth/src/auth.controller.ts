import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser, UserDocument } from '@app/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from './users/dto/create-user.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto
  ) {
    return this.authService.register(createUserDto)
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response
  ){
    await this.authService.login(user, response);
    delete user.password;
    response.send(user);
  }

  
  @Get('logout')
  async logout(
    @Res({ passthrough: true }) response: Response
  ){
    await this.authService.logout(response)
    return response.send({message: "Logged out"});
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }

}
