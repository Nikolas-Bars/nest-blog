import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../domain/blog.entity';
import { Model, ObjectId, UpdateWriteOpResult } from 'mongoose';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  public async insert(blog: {
    name: string;
    description: string;
    websiteUrl: string;
    isMemberShip: boolean;
    createdAt: string;
  }) {
    const result = await this.blogModel.insertMany(blog)
    return result[0];
  }

  public async nameIsExist(name: string) {
    const result = await this.blogModel.count({name: name})
    return result > 0
  }

  public async update(blog: {
      id: string
      name: string;
      description: string;
      websiteUrl: string;
    }
  ): Promise<boolean> {
    const result: UpdateWriteOpResult = await this.blogModel.updateOne({_id: blog.id}, {$set: {name: blog.name, description: blog.description, isMembership: false, websiteUrl: blog.websiteUrl}})

    return !!result.modifiedCount
  }

  public async delete(id: string) {
    const result = await this.blogModel.deleteOne({_id: id})

    return
  }
}