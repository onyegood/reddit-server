import {Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { Post } from '.';

@ObjectType()
@Entity()
export class User  extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number
    
    @OneToMany(() => Post, post => post.creator)
    posts: Post[]

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;
    
    @Field(() => String)
    @CreateDateColumn()
    updatedAt: Date
    
    @Field()
    @Column({ unique: true })
    username!: string;

    @Field()
    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;
}
