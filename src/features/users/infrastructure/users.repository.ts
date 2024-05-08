import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../domain/user.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  public async insert(user: {
    email: string;
    name: string;
    createdAt: string;
  }) {
    const result = await this.userModel.insertMany(user);
    return result[0];
  }

  public async nameIsExist(name: string) {
    const result = await this.userModel.count({ name: name });
    return result > 0;
  }
}
