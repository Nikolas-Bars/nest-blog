import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';

@Injectable()
export class BlogsService {
  constructor(
    private blogsRepositiry: BlogsRepository
    ) {}

  async create(name: string, description: string, websiteUrl: string) {

    const result = await this.blogsRepositiry.insert({
      description,
      name,
      isMembership: false,
      websiteUrl,
      createdAt: (new Date()).toISOString(),
    })
    return result._id
  }

  async update(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
    return await this.blogsRepositiry.update({
      id: id,
      description,
      name,
      websiteUrl
    })

  }

  async delete(id: string): Promise<boolean> {

    return await this.blogsRepositiry.delete(id)

  }
}