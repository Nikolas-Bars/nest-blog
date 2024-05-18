import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../domain/post.entity';
import { Model, SortOrder } from 'mongoose';
import { PostOutputModel, PostOutputModelMapper } from '../api/models/output/post.output.model';
import { PaginationType } from '../../../common/common-types/common-types';

export type QueryPostDataType = {
  pageNumber: number
  pageSize: number
  sortBy: string
  sortDirection: string
}

@Injectable()
export class PostsQueryRepository {

  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  public async getPostById(postId: string): Promise<PostOutputModel | null> {

    const blog = await this.postModel.findById(postId, { __v: false });

    if(blog === null) {
      return null
    }

    return PostOutputModelMapper(blog)

  }

  public async getAllPosts(sortData: QueryPostDataType): Promise<PaginationType<PostOutputModel> | null> {

    const { pageNumber, pageSize, sortBy, sortDirection } = sortData

    let filter = {}
    // указваем параметры поиска по тайтлу если нужно

    let sortOptions: {[p: string]: SortOrder | {$meta: any}} | [string, SortOrder][] | undefined | null | string = {};

    if (sortBy && sortDirection) {
      sortOptions[sortBy] = sortDirection as SortOrder;
    }
    const posts = await this.postModel
      // ищем элементы с параметрами из объекта filter
      .find(filter)
      // указываем как сортировать результаты - по умолчанию по дате создания
      .sort(sortOptions)
      // указываем параметры пагинации
      .skip((pageNumber - 1) * pageSize)
      // количество результатов на странице
      .limit(pageSize)

    // получаем общее количество документов
    const totalCount = await this.postModel
      .countDocuments(filter)

    const pagesCount = Math.ceil(totalCount / pageSize)

    if(posts === null) {
      return null
    }

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: posts.map((post) => {
        return PostOutputModelMapper(post)
      })
    } as PaginationType<PostOutputModel>

  }

  public async getPostsByBlogId(blogId: string, queryData: QueryPostDataType): Promise<PaginationType<PostOutputModel> | null> {

      const {pageNumber, pageSize, sortBy, sortDirection} = queryData

      let sortOptions: {[p: string]: SortOrder | {$meta: any}} | [string, SortOrder][] | undefined | null | string = {};

      if (sortBy && sortDirection) {
        sortOptions[sortBy] = sortDirection as SortOrder;
      }

      const posts = await this.postModel
        .find({ blogId: blogId })
        .sort(sortOptions)
        .limit(pageSize)
        .skip((pageNumber - 1) * pageSize)

      const totalCount = await this.postModel.countDocuments({blogId: blogId})

      const pagesCount = Math.ceil(totalCount / pageSize)

      if (posts.length) {

        return {
          pagesCount: pagesCount,
          page: pageNumber,
          pageSize: pageSize,
          totalCount: totalCount,
          items: posts.map((post) => {
            return PostOutputModelMapper(post)
          })
        } as PaginationType<PostOutputModel>
      } else {
        return null
      }

  }
}