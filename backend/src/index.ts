import 'reflect-metadata';
import 'dotenv-safe/config';
import { PostResolvers, UserResolvers } from './resolvers';

import { ApolloServer } from 'apollo-server-express';
import { MyContext } from './types';
import { COOKIE_NAME, __PROD__ } from './constants';
import { buildSchema } from 'type-graphql';
import connnectRedis from 'connect-redis';
import express from 'express';
import Redis from 'ioredis';
import session from 'express-session';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { Post, User } from './entities';
import path from 'path';
import { Updoot } from './entities/Updoot';
import { createUserLoader } from './utils/data-loader/createUserLoader';
import { createUpdootLoader } from './utils/data-loader/createUpdootLoader';

const main = async () => {
  const conn = await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true, //Enable on dev environment only
    migrations: [path.join(__dirname, './migrations/*')],
    entities: [User, Post, Updoot],
  });

  await conn.runMigrations();

  // Create Web Server
  const app = express();
  const port = parseInt(process.env.PORT);

  const RedisStore = connnectRedis(session);
  const redis: any = new Redis(process.env.REDIS_URL);

  app.set('trust proxy', 1);

  // Set cors origin
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 Years
        httpOnly: true,
        sameSite: 'lax', // csrf protection
        secure: __PROD__, // Cookie only works in https
        domain: __PROD__ ? '.code4me.com.ng' : undefined,
      },
      secret: process.env.SESSION_SECRET_KEY,
      resave: false,
      saveUninitialized: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolvers, UserResolvers],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      updootLoader: createUpdootLoader(),
    }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(port, () => {
    console.log(`server started on localhost:${port}`);
  });
};

main().catch((err) => {
  console.log(err);
});
