import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query-repository';
import { BlogOutputModel } from '../../blogs/api/models/output/blog.output.model';
import { UpdatePostData } from '../api/models/input/update-post';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsQueryRepository
  ) {}

  async create(title: string, shortDescription: string, content: string, blogId:  string, blogName: string) {

    const result = await this.postsRepository.insert({
      title,
      shortDescription,
      content,
      blogId,
      createdAt: (new Date()).toISOString(),
      blogName
    })
    return result._id
  }

  async isBlogExist(blogId: string): Promise<BlogOutputModel | null> {

    return await this.blogsRepository.getBlogById(blogId)

  }

  async updatePost(data: UpdatePostData): Promise<boolean> {

    return await this.postsRepository.update(data)

  }

  async deletePost(id): Promise<boolean> {

    return await this.postsRepository.delete(id)

  }
}