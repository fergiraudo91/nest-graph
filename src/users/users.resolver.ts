import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UpdateUserInput } from './dto/inputs/update-user.input';

@UseGuards(JwtAuthGuard)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.ADMIN]) user: User,
  ): Promise<User[]> {
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.ADMIN]) user: User,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, {name: 'updateUser'})
  updateUser(
    @Args('updateUserInput') updateUserInput : UpdateUserInput,
    @CurrentUser([ValidRoles.ADMIN]) user: User,
    ) : Promise<User>{
    return this.usersService.update(updateUserInput.id, updateUserInput, user);    
  }

  @Mutation(() => User)
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.ADMIN]) user: User,
  ) {
    return this.usersService.block(id, user);
  }
}
