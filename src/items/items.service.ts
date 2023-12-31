import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateItemInput, CreateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';


@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository : Repository<Item>
  ){}

  async create(createItemInput: CreateItemInput, user: User) : Promise<Item>{
    console.log(user);
    const newItem = this.itemsRepository.create({...createItemInput, user});
    return await this.itemsRepository.save(newItem);
  }

  async findAll() : Promise<Item[]> {
    return await this.itemsRepository.find()
  }

  async findOne(id: string) : Promise<Item> {
    const item = await this.itemsRepository.findOneBy({id});
    if(!item){
      throw new NotFoundException('Item not found');
    }
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput) : Promise<Item>{
    const item = await this.itemsRepository.preload(updateItemInput);
    if(!item){
      throw new NotFoundException('Item not found');
    }
    return this.itemsRepository.save(item);
  }

  async remove(id: string) : Promise<Item> {
    //TODO: soft delete, integridad referencial
    const item = await this.findOne(id);
    await this.itemsRepository.remove(item);
    return {...item, id};

  }
}
