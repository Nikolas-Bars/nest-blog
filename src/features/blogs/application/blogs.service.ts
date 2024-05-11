import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';

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
}