import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards, UsePipes,
} from '@nestjs/common';
import { UsersQueryRepository } from '../infrastructure/users.query-repository';
import { UserCreateModelDto } from './models/input/create-user.input.model';
import { UserOutputModel } from './models/output/user.output.model';
import { UsersService } from '../application/users.service';
import { QueryUserDataType } from './models/types/users-types';
import { BasicAuthGuard } from '../../../common/guards/basic.auth.guard';
import { CreateUserPipe } from '../../../infrastructure/pipes/create.user.pipe';

// Tag для swagger
@ApiTags('Users')
@Controller('users')
// Установка guard на весь контроллер
// @UseGuards(AuthGuard)
export class UsersController {
  usersService: UsersService;
  constructor(
    usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {
    this.usersService = usersService;
  }

  @Post()
  // Для переопределения default статус кода https://docs.nestjs.com/controllers#status-code
  @HttpCode(201)
  @UseGuards(BasicAuthGuard)
  @UsePipes(CreateUserPipe)
  async create(@Body() createModel: UserCreateModelDto): Promise<UserOutputModel> {
    const result = await this.usersService.create(
      createModel.email,
      createModel.login,
      createModel.password
    );

    const user = await this.usersQueryRepository.getById(result);

    if(user === null){
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get()
  @UseGuards(BasicAuthGuard)
  async getUsers(@Query() query: QueryUserDataType ) {
    const sortData = {
      sortBy: query.sortBy ?? 'createdAt',
      sortDirection: query.sortDirection ? query.sortDirection : 'desc',
      pageNumber: query.pageNumber ? +query.pageNumber : 1,
      pageSize: query.pageSize ? +query.pageSize : 10,
      searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : null,
      searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : null,
    }
    return await this.usersQueryRepository.getUsers(sortData)
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async deletePost(
    @Param('id') id: string
  ) {
    const result = await this.usersService.deleteUser(id)
    if(!result){
      throw new NotFoundException('Post not found');
    }

    return
  }
}
