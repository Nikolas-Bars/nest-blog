import { ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller, Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository, QueryPostDataType } from '../infrastructure/posts.query-repository';
import { PostOutputModel } from './models/output/post.output.model';
import { CreatePostInputModel } from './models/input/create-post.input.model';
import { BlogOutputModel } from '../../blogs/api/models/output/blog.output.model';

@ApiTags('Posts')
@Controller('Posts')
export class PostsController {

  constructor(
    private readonly postService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository
  ) {}


  @Get(':id')
  async getPost(@Param('id') id: string) {

    const post = await this.postsQueryRepository.getPostById(id)

    if(post === null){
      throw new NotFoundException('Post not found');
    } else {
      return post
    }

  }

  @Get()
  async getPosts(@Query() query: QueryPostDataType) {
    const sortData = {
      sortBy: query.sortBy ?? 'createdAt',
      sortDirection: query.sortDirection ? query.sortDirection : 'desc',
      pageNumber: query.pageNumber ? +query.pageNumber : 1,
      pageSize: query.pageSize ? +query.pageSize : 10,
    }
    return this.postsQueryRepository.getAllPosts(sortData)
  }

  @Post()
  async createPost(@Body() createModel: CreatePostInputModel): Promise<PostOutputModel> {

    const blog: BlogOutputModel | null = await this.postService.isBlogExist(createModel.blogId)

    if (blog === null) {
      throw new BadRequestException()
    } else{
      const result = await this.postService.create(
        createModel.title,
        createModel.shortDescription,
        createModel.content,
        createModel.blogId,
        blog.name
      )

      const post = await this.postsQueryRepository.getPostById(result.toString())

      if(post === null){
        throw new NotFoundException('Post not found');
      }

      return post
    }
  }

  @Put(':id')
  @HttpCode(204)
  async updatePost(@Body() updateModel: CreatePostInputModel, @Param('id') id: string) {
    const post = await this.postsQueryRepository.getPostById(id)

    if(post === null){
      throw new NotFoundException('Post not found');
    }

    const  result = await this.postService.updatePost({
      id,
      title: updateModel.title,
      blogId: updateModel.blogId,
      content: updateModel.content,
      shortDescription: updateModel.shortDescription})

    if(!result){
      throw new NotFoundException('Post not found');
    }

    return

  }

  @Delete(':id')
  @HttpCode(204)
  async deletePost(
    @Param('id') id: string
  ) {
    const result = await this.postService.deletePost(id)

    if(!result){
      throw new NotFoundException('Post not found');
    }

    return
  }


}