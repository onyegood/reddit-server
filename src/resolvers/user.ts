import { User } from '../entities';
import {Arg, Ctx, Resolver, Mutation, InputType, Field, ObjectType} from 'type-graphql';
import { MyContext } from 'src/types';
import argon2 from 'argon2';
import { FieldError } from 'src/entities/Error';

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string
    @Field()
    password: string
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    
    @Field(() => User, {nullable: true})
    user?: User
}

@Resolver()
export class UserResolvers {
    @Mutation(() => UserResponse)
    async createUser(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em }: MyContext): Promise<UserResponse> {
        if (options.username.length <= 4) {
            return {
                errors: [{
                    field: 'username',
                    message: "username must not be less than 5 characters length"
                }]
            }
        }

        if (options.password.length <= 7) {
            return {
                errors: [{
                    field: 'password',
                    message: "password must not be less than 8 characters length"
                }]
            }
        }
        
        // Encript password using argon2 
        const hashedPassword = await argon2.hash(options.password);

        const user = em.create(User, { username: options.username, password: hashedPassword });
        try {
            await em.persistAndFlush(user);
        } catch (error) {
            // duplicate username error
            if (error.code === '23505' || error.detail.includes("already exists")) {
                return {
                    errors: [{
                        field: 'username',
                        message: "username already taken"
                    }]
                }
            }
        }
        return { user };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em }: MyContext): Promise<UserResponse> {
        const user = await em.findOne(User, { username: options.username });

        if (!user) {
            return {
                errors: [{
                    field: 'username',
                    message: "that username doesn't exist"
                }]
            }
        }

        // Verify encripted password 
        const valid = await argon2.verify(user.password, options.password);
        if (!valid) {
            return {
                errors: [{
                    field: 'password',
                    message: "incorrect password"
                }]
            }
        }
        
        return { user };
    }
}