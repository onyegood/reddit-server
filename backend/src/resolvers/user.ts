import { User } from "../entities";
import {
  Arg,
  Ctx,
  Resolver,
  Mutation,
  InputType,
  Field,
  ObjectType,
  Query,
} from "type-graphql";
import { v4 } from "uuid";
import { MyContext } from "../types";
import argon2 from "argon2";
import { FieldError } from "../entities/FieldError";
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from "../constants";
import { sentEmail } from "../utils/sendEmail";
import { getConnection } from "typeorm";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  email: string;
  @Field()
  password: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolvers {
  @Query(() => User)
  async me(@Ctx() { req }: MyContext): Promise<User | undefined> {
    let sess: any = req.session;

    const userId = sess!.userId;
    // You are not logged in

    if (!userId) {
      return undefined;
    }

    const user = await User.findOne(userId);

    return user;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 7) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "password must not be less than 8 characters length",
          },
        ],
      };
    }

    const key = FORGOT_PASSWORD_PREFIX + token;

    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }

    const _userId = parseInt(userId);

    const user = await User.findOne(_userId);

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "User no longer exist",
          },
        ],
      };
    }

    await User.update(
      { id: _userId },
      {
        password: await argon2.hash(newPassword),
      }
    );

    await redis.del(key);

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // the email is not in the db
      return true;
    }

    const token = v4();

    // Save token on redis
    await redis.set(
      FORGOT_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    ); // Valid for 3 days

    await sentEmail(
      [email],
      `<a href="http://localhost:3000/change-password/${token}">Reset password</a>`
    );

    return true;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput
  ): Promise<UserResponse> {
    if (options.username.length <= 4) {
      return {
        errors: [
          {
            field: "username",
            message: "username must not be less than 5 characters length",
          },
        ],
      };
    }

    if (options.password.length <= 7) {
      return {
        errors: [
          {
            field: "password",
            message: "password must not be less than 8 characters length",
          },
        ],
      };
    }

    // Encript password using argon2
    const hashedPassword = await argon2.hash(options.password);
    let user;

    try {
      // Use query builder
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: options.username,
          email: options.email,
          password: hashedPassword,
        })
        .returning("*")
        .execute();

      // Use normal insert
      // await User.create({
      //   username: options.username,
      //   email: options.email,
      //   password: hashedPassword,
      // }).save()

      user = result.raw[0];
    } catch (error) {
      // console.log(error)
      // duplicate username error
      if (error.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      }
    }
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    let sess: any = req.session;
    const isEmail = usernameOrEmail.includes("@");
    const queryObject = isEmail
      ? { email: usernameOrEmail }
      : { username: usernameOrEmail };

    const user = await User.findOne({ where: queryObject });

    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "that username doesn't exist",
          },
        ],
      };
    }

    // Verify encripted password
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    sess!.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolved) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolved(false);
          return;
        }
        resolved(true);
      })
    );
  }
}
