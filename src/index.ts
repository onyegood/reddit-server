import 'reflect-metadata';
import {MikroORM} from '@mikro-orm/core';

import { __prod__ } from './constants';
import express from 'express';
import microConfig from './mikro-orm.config';
import {ApolloServer} from 'apollo-server-express';

import {buildSchema} from 'type-graphql';
import { PostResolvers } from './resolvers/post';


const main = async () => {
    const orm = await MikroORM.init(microConfig);
    // Run DB Migration
    await orm.getMigrator().up();

    // Create Web Server
    const app = express();
    const port = process.env.PORT || 4000;
    
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolvers],
            validate: false
        }),
        context: () => ({ em: orm.em })
    });

    await apolloServer.start()
    apolloServer.applyMiddleware({ app })

    app.listen(port, () => {
        console.log(`server started on localhost:${port}`)
    })
}

main().catch(err => {
    console.log(err);
});