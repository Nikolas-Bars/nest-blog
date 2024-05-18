import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { randomUUID } from 'crypto';

export type UserDocument = HydratedDocument<User>;

export type UserModelType = Model<UserDocument> & typeof statics;

@Schema()
export class User {
  @Prop()
  login: string;

  @Prop()
  email: string;

  @Prop()
  createdAt: Date;

  updateUser(login: string) {
    this.login = login;
  }

  static createUser(login: string, email: string | null) {
    const user = new this();

    user.login = login;
    user.email = email ?? `${randomUUID()}_${login}@it-incubator.io`;

    return user;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods = {
  updateUser: User.prototype.updateUser,
};

const statics = {
  createUser: User.createUser,
};

UserSchema.statics = statics;
