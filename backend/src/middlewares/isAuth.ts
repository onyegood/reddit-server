import { MyContext } from "src/types";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
    const sess: any = context.req.session;
    if (sess.userId) {
        throw new Error("not authenticated")
    }
    return next()
}