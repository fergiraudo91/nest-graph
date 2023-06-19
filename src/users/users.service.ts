import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { SingupInput } from 'src/auth/dto/inputs/singup.input';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { Repository } from 'typeorm';
import { UpdateUserInput } from './dto/inputs/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  private logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository : Repository<User>
  ){}

  async create(singupInput : SingupInput) : Promise<User>  {
    try {
      const encryptedPassword = bcrypt.hashSync(singupInput.password, 10);
      const newUser = this.userRepository.create({...singupInput, password: encryptedPassword});
      return await this.userRepository.save(newUser);
      
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async findAll(validRoles : ValidRoles[]) : Promise<User[]>{
    let users : User[];
    if(validRoles.length === 0){
      return await this.userRepository.find({relations: {lastUpdateBy: true}});
    }
    
    return this.userRepository.createQueryBuilder()
    .andWhere('ARRAY[roles] && ARRAY[:...validRoles]')
    .setParameter('validRoles', validRoles)
    .getMany()
  }

  async findOneByEmail(email: string) : Promise<User>{
    try {
     return await this.userRepository.findOneByOrFail({email});
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async findOneById(id: string) : Promise<User>{
    try {
     return await this.userRepository.findOneByOrFail({id});
    } catch (error) {
      throw new NotFoundException('Id not found');
    }
  }

  async update(id: string, updateUserInput: UpdateUserInput, adminUser: User) : Promise<User>{
    //TODO: updateBY
    try {
      const user = await this.userRepository.preload({...updateUserInput});
      const encryptedPassword = bcrypt.hashSync(user.password, 10);
      user.password = encryptedPassword;
      user.lastUpdateBy = adminUser;
      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDbErrors(error);
    }
    const user : User = new User();
    return user;
  }

  async block(id: string, adminUser: User) : Promise<User> {
    const userToBlock = await this.findOneById(id);
    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = adminUser;
    return await this.userRepository.save(userToBlock);
  }

  private handleDbErrors(error: any) : never{
    this.logger.error(error);
    if(error.code === '23505'){
      throw new BadRequestException(error.detail.replace('Key', ''));
    }
    throw new InternalServerErrorException('please check server logs');
  }
}
