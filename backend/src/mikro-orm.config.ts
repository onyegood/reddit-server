import { __PROD__ } from "./constants";
import {MikroORM} from '@mikro-orm/core'
import path from 'path'
import { User, Post } from "./entities";

export default {
    migrations: {
        path: path.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.tj$/,
    },
    entities: [Post, User],
    dbName: 'lireddit',
    password: 'password',
    type: 'postgresql',
    debug: !__PROD__
} as Parameters<typeof MikroORM.init>[0];