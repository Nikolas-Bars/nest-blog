import { PostDocument } from '../../../domain/post.entity';

export class PostOutputModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    dislikesCount: number;
    likesCount: number;
    myStatus: string;
    newestLikes: any[];
  }
}

// MAPPERS

export const PostOutputModelMapper = (post: PostDocument): PostOutputModel => {
  const outputModel = new PostOutputModel();

  outputModel.id = post.id;
  outputModel.title = post.title;
  outputModel.createdAt = post.createdAt
  outputModel.shortDescription = post.shortDescription;
  outputModel.content = post.content;
  outputModel.blogId = post.blogId;
  outputModel.blogName = post.blogName;
  outputModel.extendedLikesInfo = post.extendedLikesInfo;

  return outputModel;
};