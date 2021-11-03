import { Post } from '../entities/Post';
import {Arg, Int, Query, Resolver, Mutation} from 'type-graphql';

@Resolver()
export class PostResolvers {
    @Query(() => [Post])
    posts(): Promise<Post[]> {
        return Post.find()
    }

    @Query(() => Post, { nullable: true })
    post(
        @Arg('id', () => Int) id: number 
    ): Promise<Post | undefined> {
        return Post.findOne(id)
    }

    @Mutation(() => Post)
    async createPost(
        @Arg('title', () => String) title: string
        ): Promise<Post> {
        return Post.create({title}).save();
    }

    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Arg('id', () => Int) id: number,
        @Arg('title', () => String) title: string
        ): Promise<Post | undefined> {
        const post = await Post.findOne(id);

        if (!post) {
            return undefined;
        }

        if (typeof title !== 'undefined') {
            post.title = title;
            await Post.update({id}, {title});
        }

        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id', () => Int) id: number
        ): Promise<boolean> {
        await Post.delete(id);
        return true;
    }
}