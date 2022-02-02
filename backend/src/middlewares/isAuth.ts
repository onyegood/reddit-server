import { MyContext } from "../types";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!(context.req.session as any).userId) {
    throw new Error("not authenticated");
  }
  return next();
};
