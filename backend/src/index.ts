import "reflect-metadata";

import { PostResolvers, UserResolvers } from "./resolvers";

import { ApolloServer } from "apollo-server-express";
import { MikroORM } from "@mikro-orm/core";
import { MyContext } from "./types";
import { COOKIE_NAME, __prod__ } from "./constants";
import { buildSchema } from "type-graphql";
import connnectRedis from "connect-redis";
import express from "express";
import microConfig from "./mikro-orm.config";
import redis from "redis";
import session from "express-session";
import cors from 'cors';

const main = async () => {
    const orm = await MikroORM.init(microConfig);
  // Run DB Migration
    await orm.getMigrator().up();

  // Create Web Server
    const app = express();
    const port = process.env.PORT || 4000;

    const RedisStore = connnectRedis(session);
    const redisClient = redis.createClient();

    // Set cors origin 
    app.use(cors({
        origin: "http://localhost:3000",
        credentials: true
    }))

    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({ 
                client: redisClient,
                disableTouch: true
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 Years
                httpOnly: true,
                sameSite: "lax", // csrf protection
                secure: __prod__ // Cookie only works in https
            },
            secret: 'process.env.SESSION_SECRET_KEY',
            resave: false,
            saveUninitialized: false
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolvers, UserResolvers],
            validate: false,
        }),
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
    });

    await apolloServer.start();
    
    apolloServer.applyMiddleware({ 
        app, 
        cors: false
    });

    app.listen(port, () => {
        console.log(`server started on localhost:${port}`);
    });
};

main().catch((err) => {
    console.log(err);
});
