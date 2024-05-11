import {
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { appSettings } from './settings/app-settings';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { UsersService } from './features/users/application/users.service';
import { UsersQueryRepository } from './features/users/infrastructure/users.query-repository';
import { User, UserSchema } from './features/users/domain/user.entity';
import { UsersController } from './features/users/api/users.controller';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { NameIsExistConstraint } from './common/decorators/validate/name-is-exist.decorator';
import { BlogsRepository } from './features/blogs/infrastructure/blogs.repository';
import { BlogsService } from './features/blogs/application/blogs.service';
import { BlogsQueryRepository } from './features/blogs/infrastructure/blogs.query-repository';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { Blog, BlogSchema } from './features/blogs/domain/blog.entity';
import { DeleteAllController } from './features/deleteAll/delete-all.controller';

const usersProviders: Provider[] = [
  UsersRepository,
  UsersService,
  UsersQueryRepository,
];

const blogsProviders: Provider[] = [
  BlogsRepository,
  BlogsService,
  BlogsQueryRepository
]

@Module({
  // Регистрация модулей
  imports: [
    MongooseModule.forRoot(
      appSettings.env.isTesting()
        ? appSettings.api.MONGO_CONNECTION_URI_FOR_TESTS
        : appSettings.api.MONGO_CONNECTION_URI,
      { dbName: 'blogsdb' }
    ),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
      ]),
  ],
  // Регистрация провайдеров
  providers: [
    ...usersProviders,
    ...blogsProviders,
    NameIsExistConstraint,
    /* {
            provide: UsersService,
            useClass: UsersService,
        },*/
    /*{
            provide: UsersService,
            useValue: {method: () => {}},

        },*/
    // Регистрация с помощью useFactory (необходимы зависимости из ioc, подбор провайдера, ...)
    /* {
            provide: UsersService,
            useFactory: (repo: UsersRepository) => {
                return new UsersService(repo);
            },
            inject: [UsersRepository]
        }*/
  ],
  // Регистрация контроллеров
  controllers: [UsersController, BlogsController, DeleteAllController],
})
export class AppModule implements NestModule {
  // https://docs.nestjs.com/middleware#applying-middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
