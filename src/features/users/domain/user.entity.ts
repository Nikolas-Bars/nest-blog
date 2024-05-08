import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { randomUUID } from 'crypto';

export type UserDocument = HydratedDocument<User>;

export type UserModelType = Model<UserDocument> & typeof statics;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  createdAt: Date;

  updateUser(name: string) {
    this.name = name;
  }

  static createUser(name: string, email: string | null) {
    const user = new this();

    user.name = name;
    user.email = email ?? `${randomUUID()}_${name}@it-incubator.io`;

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
