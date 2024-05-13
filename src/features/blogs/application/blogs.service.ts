import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { Schema, Types, ObjectId } from 'mongoose';

@Injectable()
export class BlogsService {
  constructor(private blogsRepositiry: BlogsRepository) {}

  async create(name: string, description: string, websiteUrl: string) {

    const result = await this.blogsRepositiry.insert({
      description,
      name,
      isMemberShip: false,
      websiteUrl,
      createdAt: (new Date()).toISOString(),
    })
    return result._id
  }

  async update(id: string, name: string, description: string, websiteUrl: string) {
    const result = await this.blogsRepositiry.update({
      id: id,
      description,
      name,
      websiteUrl
    })

    return true
  }

  async delete(id: string) {
    const result = await this.blogsRepositiry.delete(id)

    return result
  }
}