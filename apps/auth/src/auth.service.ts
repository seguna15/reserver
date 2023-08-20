import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserDocument } from '@app/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token-payload.interface';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UsersService } from './users/users.service';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository
  ) {}

  async create(createUserDTO: CreateUserDto) {
        await this.validateCreateUserDto(createUserDTO);
        return this.authRepository.create({
            ...createUserDTO,
            password: await bcrypt.hash(createUserDTO.password, 10)
        });
    }
  private async validateCreateUserDto(createUserDto: CreateUserDto) {
        try {
            await this.authRepository.findOne({ email: createUserDto.email });
        } catch (error) {
            return;
        }
        throw new UnprocessableEntityException('Email already exist.');
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
      secure: true,
      sameSite: 'none',
    }); //sameSite: 'none', secure: true, for production
  }


  async logout(
    response: Response
  ) {
      
    
      response.clearCookie('Authentication', { httpOnly: true, maxAge: 0});
  }

}
