import { User } from '../entities';
import {Arg, Ctx, Query, Resolver, Mutation, InputType, Field} from 'type-graphql';
import { MyContext } from 'src/types';

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string
    @Field()
    password: string
}



@Resolver()
export class UserResolvers {
    @Mutation(() => User)
    async createUser(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em }: MyContext): Promise<User> {
        const user = em.create(User, { username: options.username });
        await em.persistAndFlush(user);
        return user;
    }
}