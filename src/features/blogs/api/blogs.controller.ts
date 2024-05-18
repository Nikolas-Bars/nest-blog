import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository, SortDataType } from '../infrastructure/blogs.query-repository';
import { BlogCreateModel } from './models/input/create-blog.input.model';
import { BlogOutputModel } from './models/output/blog.output.model';
import { PostsQueryRepository, QueryPostDataType } from '../../posts/infrastructure/posts.query-repository';
import {
  CreatePostInputModel,
  CreatePostInputModelFromBlogRoute,
} from '../../posts/api/models/input/create-post.input.model';
import { PostsService } from '../../posts/application/posts.service';

@ApiTags('Blogs')
@Controller('Blogs')
export class BlogsController {

  blogService: BlogsService

  constructor(

    blogService: BlogsService,
    private readonly blogQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postsService: PostsService

  ) {
    this.blogService = blogService
  }

  @Get(':id/posts')
  async getPostsByBlog(
    @Param('id') id: string,
    @Query() query: QueryPostDataType
  ) {

    const blog = await this.blogQueryRepository.getBlogById(id)

    if(blog === null){
      throw new NotFoundException('Blog not found');
    }

    const queryData = {
      sortBy: query.sortBy ?? 'createdAt',
      sortDirection: query.sortDirection ?? 'desc',
      pageNumber: query.pageNumber ? +query.pageNumber : 1,
      pageSize: query.pageSize ? +query.pageSize : 10
    }

    return this.postsQueryRepository.getPostsByBlogId(id, queryData)
  }


  @Get(':id')
  async getBlog(
    @Param('id') id: string
  ) {

    const blog = await this.blogQueryRepository.getBlogById(id)
    if(blog === null) {
      throw new NotFoundException('Blog not found')
    } else {
      return blog
    }

  }

  @Get('')
  async getAllBlogs(
    @Query() query: SortDataType
  ) {
    const sortData = {
      searchNameTerm: query.searchNameTerm ?? null,
      sortBy: query.sortBy ?? 'createdAt',
      sortDirection: query.sortDirection ? query.sortDirection : 'desc',
      pageNumber: query.pageNumber ? +query.pageNumber : 1,
      pageSize: query.pageSize ? +query.pageSize : 10,
    }
    return this.blogQueryRepository.getAllBlogs(sortData)
  }

  @Post(':id/posts')
  async createPostForBlog(
    @Param('id') id: string,
    @Body() createPostModel: CreatePostInputModelFromBlogRoute
  ) {

    const blog = await this.blogQueryRepository.getBlogById(id)

    if(blog === null){
      throw new NotFoundException('Blog not found');
    }

    const result = await this.postsService.create(
      createPostModel.title,
      createPostModel.shortDescription,
      createPostModel.content,
      id,
      blog.name
    )

    return await this.postsQueryRepository.getPostById(result.toString())
  }

  @Post()
  async createBlog(@Body() createModel: BlogCreateModel): Promise<BlogOutputModel> {

    const result = await this.blogService.create(
      createModel.name,
      createModel.description,
      createModel.websiteUrl,
    )

    const blog = await this.blogQueryRepository.getBlogById(result.toString())

    if(blog === null){
      throw new NotFoundException('Blog not found');
    }

    return blog
  }

  @Put(':id')
  @HttpCode(204)
  async updateBlog(
    @Body() updateModel: BlogCreateModel,
    @Param('id') id: string
  ) {
    const result = await this.blogService.update(
      id,
      updateModel.name,
      updateModel.description,
      updateModel.websiteUrl,
    )

    if(!result){
      throw new NotFoundException('Post not found');
    }

    return
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(
    @Param('id') id: string
  ) {
    const result = await this.blogService.delete(id)
    if (!result) {
      throw new NotFoundException('Blog not found')
    }

    return
  }

}