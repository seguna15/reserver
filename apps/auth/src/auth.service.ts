import { Injectable } from '@nestjs/common';
import { UserDocument } from '@app/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token-payload.interface';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService
  ) {}

   async register(createUserDTO: CreateUserDto) {
      return await this.userService.create(createUserDTO);
    }

  async login(user: UserDocument, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    }

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION')
    );

    const token  = this.jwtService.sign(tokenPayload);

     response.cookie('Authentication', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,  
      
    }); //sameSite: 'none', secure: true, for production
  }


  async logout(
    response: Response
  ) {
      
    
      response.clearCookie('Authentication', { httpOnly: true, maxAge: 0});
  }

}
