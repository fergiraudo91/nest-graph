import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginInput, SingupInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService : JwtService
    ) {}

  async singUp(singupInput: SingupInput): Promise<AuthResponse> {
    const user = await this.userService.create(singupInput);
    const token = this.getJwtoken(user.id);
    return {
      token,
      user,
    };
  }

  async login(loginInput : LoginInput) : Promise<AuthResponse>{

    const user = await this.userService.findOneByEmail(loginInput.email);
    if(!bcrypt.compareSync(loginInput.password, user.password)){
      throw new BadRequestException('email/password dont match');
    }
    const token = this.getJwtoken(user.id);
    return {
      token,
      user
    }
  }
  async validateUser(id: string) : Promise<User>{
    const user = await this.userService.findOneById(id);
    if(!user.isActive){
      throw new UnauthorizedException('User is inactive');
    }
    delete user.password;
    return user;
  }

  private getJwtoken(id) : string {
    const token = this.jwtService.sign({id});
    return token;
  }

  revalidateToken(user: User): AuthResponse{
    const token = this.getJwtoken(user.id);
    return {
      token,
      user
    }
  }
}