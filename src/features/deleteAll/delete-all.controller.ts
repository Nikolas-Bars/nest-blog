import { Controller, Delete, HttpCode } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../blogs/domain/blog.entity';
import { User } from '../users/domain/user.entity';
import { Post } from '../posts/domain/post.entity';

@Controller('testing')
export class DeleteAllController {
  constructor(
    @InjectModel('Blog') private readonly blogModel: Model<Blog>,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Post') private readonly postModel: Model<Post>,
  ) {}

  @HttpCode(204)
  @Delete('all-data')
  async deleteAllData() {

      // Удаление всех данных из модели BlogModel
      await this.blogModel.deleteMany({});

      // Удаление всех данных из модели UserModel
      await this.userModel.deleteMany({});

      await this.postModel.deleteMany({});

      return;
  }
}
