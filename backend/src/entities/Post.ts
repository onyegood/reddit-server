import {Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, BaseEntity, ManyToOne} from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { User } from '.';

@ObjectType()
@Entity()
export class Post extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number

    @Field()
    @Column()
    title!: string;

    @Field()
    @Column()
    text!: string;

    @Field()
    @Column({ type: "inet", default: 0 })
    points!: number;

    @Field(() => String)
    @Column()
    creatorId: number;

    @ManyToOne(() => User, user => user.posts)
    creator: User
    
    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;
    
    @Field(() => String)
    @CreateDateColumn()
    updatedAt: Date;
}