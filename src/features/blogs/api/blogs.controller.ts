import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository, SortDataType } from '../infrastructure/blogs.query-repository';
import { BlogCreateModel } from './models/input/create-blog.input.model';
import { BlogOutputModel } from './models/output/blog.output.model';

@ApiTags('Blogs')
@Controller('Blogs')
export class BlogsController {

  blogService: BlogsService

  constructor(

    blogService: BlogsService,
    private readonly blogQueryRepository: BlogsQueryRepository

  ) {
    this.blogService = blogService
  }

  @Get(':id')
  async getBlog(
    @Param('id') id: string
  ) {
    console.log('aaaaa');
    return this.blogQueryRepository.getBlogById(id)
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

}