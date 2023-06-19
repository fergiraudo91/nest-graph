import { CreateItemInput } from './create-item.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {
  
  @IsUUID()
  @Field(() => ID)
  id: string;
}
