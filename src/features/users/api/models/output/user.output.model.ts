import { UserDocument } from '../../../domain/user.entity';

export class UserOutputModel {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
}

// MAPPERS

export const UserOutputModelMapper = (user: UserDocument): UserOutputModel => {
  const outputModel = new UserOutputModel();

  outputModel.id = user.id;
  outputModel.login = user.login;
  outputModel.email = user.email;
  outputModel.createdAt = user.createdAt;

  return outputModel;
};
