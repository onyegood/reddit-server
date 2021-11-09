import { Entity, Column, BaseEntity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post, User } from ".";

@Entity()
export class Updoot extends BaseEntity {
  @Column({ type: "int" })
  value: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User, (user) => user.updoots, {
    onDelete: "CASCADE",
  })
  user: User;

  @PrimaryColumn()
  postId: number;

  @ManyToOne(() => Post, (post) => post.updoots, {
    onDelete: "CASCADE",
  })
  post: Post;
}
