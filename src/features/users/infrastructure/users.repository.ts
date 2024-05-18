import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../domain/user.entity';
import { DeleteResult } from '../../../common/common-types/common-types';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  public async insert(user: {
    email: string;
    login: string;
    password:  string;
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
}
