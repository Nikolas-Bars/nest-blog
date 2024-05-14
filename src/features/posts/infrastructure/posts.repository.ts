import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, ObjectId } from 'mongoose';
import { Post } from '../domain/post.entity';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  public async insert(post: {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    createdAt: string;
    blogName: string
  }) {
    const result = await this.postModel.insertMany(post)
    return result[0];
  }

  public async postIsExist(title: string) {
    const result = await this.postModel.count({title: title})
    return result > 0
  }
}