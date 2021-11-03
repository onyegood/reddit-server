import "reflect-metadata";

import { PostResolvers, UserResolvers } from "./resolvers";

import { ApolloServer } from "apollo-server-express";
import { MyContext } from "./types";
import { COOKIE_NAME, __PROD__ } from "./constants";
import { buildSchema } from "type-graphql";
import connnectRedis from "connect-redis";
import express from "express";
import Redis from "ioredis";
import session from "express-session";
import cors from 'cors';
import {createConnection} from 'typeorm';
import { Post, User } from "./entities";

const main = async () => {
    await createConnection({
        type: 'postgres',
        database: 'litreddit2',
        username: 'postgres',
        password: 'postgres',
        logging: true,
        synchronize: true,
        entities: [User, Post]
    })


  // Create Web Server
    const app = express();
    const port = process.env.PORT || 4000;

    const RedisStore = connnectRedis(session);
    const redis = new Redis();

    // Set cors origin 
    app.use(cors({
        origin: "http://localhost:3000",
        credentials: true
    }))

    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({ 
                client: redis,
                disableTouch: true
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 Years
                httpOnly: true,
                sameSite: "lax", // csrf protection
                secure: __PROD__ // Cookie only works in https
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
        context: ({ req, res }): MyContext => ({ req, res, redis }),
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
