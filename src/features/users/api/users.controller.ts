import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode, NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersQueryRepository } from '../infrastructure/users.query-repository';
import { UserCreateModel } from './models/input/create-user.input.model';
import { UserOutputModel } from './models/output/user.output.model';
import { UsersService } from '../application/users.service';
import { NumberPipe } from '../../../common/pipes/number.pipe';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { Request, Response } from 'express';
import { QueryUserDataType } from './models/types/users-types';

// Tag для swagger
@ApiTags('Users')
@Controller('users')
// Установка guard на весь контроллер
//@UseGuards(AuthGuard)
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
  async create(@Body() createModel: UserCreateModel): Promise<UserOutputModel> {
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
