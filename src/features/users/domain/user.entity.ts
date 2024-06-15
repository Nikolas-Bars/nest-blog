import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { randomUUID } from 'crypto';
import { ObjectId } from 'mongodb';

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

  @Prop()
  password: string;

  @Prop()
  salt: string;

  updateUser(login: string) {
    this.login = login;
  }

  @Prop({
    type: {
      confirmationCode: String,
      expirationDate: Date,
      expirationRecoveryDate: Date,
      isConfirmed: Boolean,
      recoveryCode: String // исправлено на String, так как коды обычно представляют строки
    },
    required: false, // Делаем поле необязательным
  })
  emailConfirmation?: {
    confirmationCode: string;
    expirationDate: Date;
    expirationRecoveryDate: Date;
    isConfirmed: boolean;
    recoveryCode: string; // исправлено на string, так как коды обычно представляют строки
  };

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
