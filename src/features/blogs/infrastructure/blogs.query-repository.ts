import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../domain/blog.entity';
import { Model, SortOrder } from 'mongoose';
import { BlogOutputModel, BlogOutputModelMapper } from '../api/models/output/blog.output.model';
import { PaginationType } from '../../../common/common-types/common-types';

export type SortDataType = {searchNameTerm?: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: string}

@Injectable()
export class BlogsQueryRepository {

  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  public async getBlogById(blogId: string): Promise<BlogOutputModel | null> {

    const blog = await this.blogModel.findById(blogId, { __v: false });

    if(blog === null) {
      return null
    }

    return BlogOutputModelMapper(blog)

  }

  public async getAllBlogs(sortData): Promise<PaginationType<BlogOutputModel> | null> {

    const { searchNameTerm, pageNumber, pageSize, sortBy, sortDirection } = sortData

    let filter = {}
    // указваем параметры поиска по тайтлу если нужно
    if (searchNameTerm) {
      // записываем в параметры для поиска. Если сюда не попадем значит будут возвращены все элементы.
      filter = {
        name: {
          // ищем в name указанную строку
          $regex: searchNameTerm,
          // игнорирование регистра
          $options: 'i'
        }
      }
    }
    let sortOptions: {[p: string]: SortOrder | {$meta: any}} | [string, SortOrder][] | undefined | null | string = {};

    if (sortBy && sortDirection) {
      sortOptions[sortBy] = sortDirection;
    }
    const blogs = await this.blogModel
      // ищем элементы с параметрами из объекта filter
      .find(filter)
      // указываем как сортировать результаты - по умолчанию по дате создания
      .sort(sortOptions)
      // указываем параметры пагинации
      .skip((pageNumber - 1) * pageSize)
      // количество результатов на странице
      .limit(pageSize)

    // получаем общее количество документов
    const totalCount = await this.blogModel
      .countDocuments(filter)

    const pagesCount = Math.ceil(totalCount / pageSize)

    if(blogs === null) {
      return null
    }

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      // каждый блог нужно мапить так как в нем не вкусный id
      items: blogs.map((blog) => {
        return BlogOutputModelMapper(blog)
      })
    } as PaginationType<BlogOutputModel>

  }

}