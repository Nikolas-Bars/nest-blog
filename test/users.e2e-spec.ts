import { initSettings } from './utils/init-settings';
import { UsersTestManager } from './utils/users-test-manager';
import { INestApplication } from '@nestjs/common';
import { UsersService } from '../src/features/users/application/users.service';
import { UserServiceMock } from './mock/user.service.mock';
import request from 'supertest';

describe('users', () => {
  let app: INestApplication;
  let userTestManger: UsersTestManager;

  beforeAll(async () => {
    const result = await initSettings((moduleBuilder) =>
      //override UsersService еще раз
      moduleBuilder.overrideProvider(UsersService).useClass(UserServiceMock),
    );
    app = result.app;
    userTestManger = result.userTestManger;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create user', async () => {
    const body = { name: 'name111', email: 'email@email.em' };

    const response = await userTestManger.createUser('123', body);

    expect(response.body).toEqual({ ...body, id: expect.any(String) });
  });

  it('should get user', async () => {
    const body = { name: 'name2', email: 'email2@email.em' };

    const createUserResponse = await userTestManger.createUser('123', body);

    const getUserResponse = await request(app.getHttpServer())
      .get(`/api/users/${createUserResponse.body.id}`)
      .expect(200);

    expect(createUserResponse.body).toEqual(getUserResponse.body);
  });
});
