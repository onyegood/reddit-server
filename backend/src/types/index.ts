import { Request, Response } from "express";
import { Redis } from "ioredis";
import { createUpdootLoader } from "../utils/data-loader/createUpdootLoader";
import { createUserLoader } from "../utils/data-loader/createUserLoader";

export type MyContext = {
  req: Request;
  res: Response;
  redis: Redis;
  userLoader: ReturnType<typeof createUserLoader>;
  updootLoader: ReturnType<typeof createUpdootLoader>;
};
