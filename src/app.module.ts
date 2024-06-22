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
import { PostsController } from './features/posts/api/posts.controller';
import { PostsRepository } from './features/posts/infrastructure/posts.repository';
import { PostsService } from './features/posts/application/posts.service';
import { PostsQueryRepository } from './features/posts/infrastructure/posts.query-repository';
import { Post, PostSchema } from './features/posts/domain/post.entity';
import { AuthService } from './features/auth/auth.service';
import { AuthController } from './features/auth/auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CreateUserPipe } from './infrastructure/pipes/create.user.pipe';
import { MailService } from './features/email/mail.service';
import { LoginIsExistDecorator } from './common/decorators/validate/login-is-exist.decorator';
import { EmailIsExistDecorator } from './common/decorators/validate/email-is-exist.decorator';
import { ConfirmCodePipe } from './infrastructure/pipes/confirm.code.pipe';

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

const postsProviders: Provider[] = [
  PostsRepository,
  PostsService,
  PostsQueryRepository
]

const authProviders: Provider[] = [
  AuthService
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
      { name: Post.name, schema: PostSchema },
      ]),
    JwtModule.register({
      secret: '4815162342', // Замени на свой секретный ключ
      signOptions: { expiresIn: '5h' }, // Настройки времени жизни токена
    }),
  ],
  // Регистрация провайдеров
  providers: [
    ...usersProviders,
    ...blogsProviders,
    ...postsProviders,
    AuthService,
    MailService,
    CreateUserPipe,
    ConfirmCodePipe,
    NameIsExistConstraint,
    LoginIsExistDecorator,
    EmailIsExistDecorator,
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
  controllers: [UsersController, BlogsController, DeleteAllController, PostsController, AuthController],
})
export class AppModule implements NestModule {
  // https://docs.nestjs.com/middleware#applying-middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
