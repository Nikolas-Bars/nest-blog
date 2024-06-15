import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../domain/user.entity';
import { DeleteResult } from '../../../common/common-types/common-types';
import { UserDbType } from '../api/models/types/users-types';
import { WithId } from 'mongodb';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  public async insert(user: {
    email: string;
    login: string;
    password:  string;
    salt: string,
    createdAt: string;
  }) {

    const result = await this.userModel.insertMany(user);
    return result[0];

  }

  public async nameIsExist(name: string) {
    const result = await this.userModel.count({ name: name });
    return result > 0;
  }

  public async delete(id: string): Promise<boolean> {
    const result: DeleteResult  = await this.userModel.deleteOne({_id: id})
    return !!result.deletedCount
  }
  public async checkExistenceOfUser(email: string, login: string): Promise<boolean> {

    const byLogin = await this.userModel.findOne({ login: login })
    const byEmail = await this.userModel.findOne({ email: email })

    return !!byEmail || !!byLogin
  }
  public async findByLoginOrEmail(loginOrEmail): Promise<WithId<UserDbType> | null> {
    const result = await this.userModel.findOne({
      $or: [
        {login: loginOrEmail},
        {email: loginOrEmail}
      ]
    }) as WithId<UserDbType>

    if (result) {
      return result
    } else {
      return null
    }
  }
}
