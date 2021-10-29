import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import redis from "redis";
import session from "express-session";
import connnectRedis from "connect-redis";
import { __prod__ } from "./constants";
import express from "express";
import microConfig from "./mikro-orm.config";
import { ApolloServer } from "apollo-server-express";

import { buildSchema } from "type-graphql";
import { PostResolvers, UserResolvers } from "./resolvers";

const main = async () => {
    const orm = await MikroORM.init(microConfig);
  // Run DB Migration
    await orm.getMigrator().up();

  // Create Web Server
    const app = express();
    const port = process.env.PORT || 4000;

    const RedisStore = connnectRedis(session);
    const redisClient = redis.createClient();

    app.use(
        session({
            name: "qid",
            store: new RedisStore({ 
                client: redisClient,
                disableTouch: true
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 Years
                httpOnly: true,
                secure: __prod__ // Cookie only works in https
            },
            secret: 'process.env.SESSION_SECRET_KEY',
            resave: false,
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolvers, UserResolvers],
            validate: false,
        }),
        context: () => ({ em: orm.em }),
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    app.listen(port, () => {
        console.log(`server started on localhost:${port}`);
    });
};

main().catch((err) => {
    console.log(err);
});
