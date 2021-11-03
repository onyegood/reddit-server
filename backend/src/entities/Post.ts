import {Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, BaseEntity} from 'typeorm';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Post extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number
    
    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;
    
    @Field(() => String)
    @CreateDateColumn()
    updatedAt: Date;
    
    @Field()
    @Column()
    title!: string;
}