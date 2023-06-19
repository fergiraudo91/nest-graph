import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

@InputType()
export class SingupInput{
    
    @Field(() => String)
    @IsEmail()
    email: string;
    
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    fullName: string;
    
    @Field(() => String)
    @MinLength(6)
    password: string;
}