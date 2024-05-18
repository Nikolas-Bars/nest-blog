import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, ObjectId, UpdateWriteOpResult } from 'mongoose';
import { Post } from '../domain/post.entity';
import { UpdatePostData } from '../api/models/input/update-post';
import { DeleteResult } from '../../../common/common-types/common-types';

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

  public async update(data: UpdatePostData): Promise<boolean> {
    const result: UpdateWriteOpResult = await this.postModel.updateOne({_id: data.id},
      {$set: {
          blogId: data.blogId,
          content: data.content,
          shortDescription: data.shortDescription,
          title: data.title
        }}
      )

    return !!result.modifiedCount
  }

  public async delete(id: string): Promise<boolean> {
    const result: DeleteResult  = await this.postModel.deleteOne({_id: id})
    console.log(result, '@HttpCode(204)ssdsdssdsd');
    return !!result.deletedCount
  }

}