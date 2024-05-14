import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PostModelType = Model<PostDocument>;

interface LikesInfo {
  dislikesCount: number;
  likesCount: number;
  myStatus: string;
  newestLikes: any[]; // Замените на тип вашего массива новых лайков, если он имеет определенный тип
}


export type PostDocument = HydratedDocument<Post>

@Schema()
export class Post {
  @Prop()
  title: string

  @Prop()
  shortDescription: string

  @Prop()
  content: string

  @Prop()
  blogId: string

  @Prop()
  blogName: string

  @Prop()
  createdAt: Date

  @Prop({ type: Object, default: {
      dislikesCount: 0,
      likesCount: 0,
      myStatus: 'None',
      newestLikes: []
  }})
  extendedLikesInfo: LikesInfo
}

export const PostSchema = SchemaFactory.createForClass(Post)

