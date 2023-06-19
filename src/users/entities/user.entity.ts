import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { Item } from 'src/items/entities/item.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  fullName: string;

  @Column({unique: true})
  @Field(() => String)
  email: string;

  @Column()
  password: string;

  @Column({type: 'text', array: true, default: [ValidRoles.USER]})
  @Field(() => [String])
  roles: string[];

  @Column({type: 'boolean', default: true})
  @Field(() => Boolean)
  isActive: boolean;

  //TODO Relaciones
  @ManyToOne(() => User, (user) => user.lastUpdateBy, {nullable: true, lazy: true})
  @JoinColumn({name: 'lastUpdateBy'})
  @Field(() => User, {nullable: true})
  lastUpdateBy?: User;

  @OneToMany(() => Item, (item) => item.user)
  @Field(() => [Item])
  items: Item[];

}
