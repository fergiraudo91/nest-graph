import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { SingupInput, LoginInput } from './dto/inputs';
import { ValidRoles } from './enums/valid-roles.enum';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthResponse } from './types/auth-response.type';

@Resolver(() => AuthResolver)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'singup' })
  async singUp(
    @Args('singupInput') singupInput: SingupInput,
  ): Promise<AuthResponse> {
    return await this.authService.singUp(singupInput);
  }

  @Mutation(() => AuthResponse, {name: 'login'})
  async login(
    @Args('loginInput') loginInput : LoginInput
  ) : Promise<AuthResponse>{
    return await this.authService.login(loginInput);
  }

  @Query(() => AuthResponse, {name: 'revalidate'})
  @UseGuards(JwtAuthGuard)
  revalidateToken(
    @CurrentUser([ValidRoles.ADMIN]) user: User
  ) : AuthResponse{
    const {token} = this.authService.revalidateToken(user);
   return {
     token,
     user
   }
  }
}
