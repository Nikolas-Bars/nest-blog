import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../domain/user.entity';
import { Model, SortOrder } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserOutputModel,
  UserOutputModelMapper,
} from '../api/models/output/user.output.model';
import { UsersRepository } from './users.repository';
import { QueryUserDataType } from '../api/models/types/users-types';

// export abstract class BaseQueryRepository<M> {
//     protected constructor(private model: Model<M>) {
//     }
//
//     async find(filter: FilterQuery<M>,
//                projection?: ProjectionType<M> | null | undefined,
//                options?: QueryOptions<M> | null | undefined,
//                pagination: {skip: number, limit: number }) {
//         return this.model.find<M>(filter, projection, options)
//     }
// }

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  public async getById(userId: string): Promise<UserOutputModel | null> {
    const user = await this.userModel.findById(userId, { __v: false });

    if(user === null) return null;

    return UserOutputModelMapper(user);
  }

  public async getUsers(data: QueryUserDataType) {
    const { pageNumber, pageSize, sortBy, sortDirection, searchEmailTerm, searchLoginTerm } = data

    let filter = {};

    const correctParams = {
      pageNumber: pageNumber ? +pageNumber : 1,
      pageSize: pageSize ? +pageSize : 10,
      sortBy: sortBy ?? 'createdAt',
      sortDirection: sortDirection ?? 'desc',
      searchEmailTerm: searchEmailTerm ?? null,
      searchLoginTerm: searchLoginTerm ?? null
    }

    if (searchLoginTerm && searchEmailTerm) {
      filter = {
        $or: [
          {login: { $regex: searchLoginTerm, $options: 'i' }},
          {email: { $regex: searchEmailTerm, $options: 'i' }},
        ]
      }
    } else {
      if(searchLoginTerm) filter = {login: { $regex: searchLoginTerm, $options: 'i' }}
      if(searchEmailTerm) filter = {email: { $regex: searchEmailTerm, $options: 'i' }}
    }

    const totalCount = await this.userModel
      .countDocuments(filter)

    let sortOptions: {[p: string]: SortOrder | {$meta: any}} | [string, SortOrder][] | undefined | null | string = {};

    if (correctParams?.sortBy && correctParams?.sortDirection) {
      sortOptions[correctParams.sortBy] = correctParams.sortDirection as SortOrder;
    }

    const users = await this.userModel
      .find(filter)
      .skip((correctParams.pageNumber - 1) * correctParams.pageSize)
      .limit(correctParams.pageSize)
      .sort(sortOptions)

    return {
      page: correctParams.pageNumber,
      pagesCount: Math.ceil(totalCount / correctParams.pageSize),
      pageSize: correctParams.pageSize,
      totalCount: totalCount,
      items: users.map((user) => {
        return UserOutputModelMapper(user)
      })
    }
  }
}
