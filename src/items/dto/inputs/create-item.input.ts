import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  name: string;

  // @IsPositive()
  // @IsNumber()
  // @Field(() => Int)
  // quantity: number;

  @IsOptional()
  @IsString()
  @Field(() => String, {nullable: true})
  quantityUnits?: string;
}
