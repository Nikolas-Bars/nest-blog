import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { User } from '../domain/user.entity';
import { DeleteResult } from '../../../common/common-types/common-types';
import { UserDbType } from '../api/models/types/users-types';
import { ObjectId, WithId } from 'mongodb';

type InsertUserType = {
  email: string;
  login: string;
  password:  string;
  salt: string,
  createdAt: string;
  emailConfirmation?: {
    isConfirmed: boolean
  }
}

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  public async insert(user: InsertUserType) {

    const result = await this.userModel.insertMany(user);

    return result[0];

  }

  public async nameIsExist(name: string) {
    const result = await this.userModel.count({ name: name });
    return result > 0;
  }

  public async delete(id: string): Promise<boolean> {
    const result: DeleteResult  = await this.userModel.deleteOne({_id: id})
    return !!result.deletedCount
  }
  public async checkExistenceOfUser(email: string, login: string): Promise<boolean> {

    const byLogin = await this.userModel.findOne({ login: login })
    const byEmail = await this.userModel.findOne({ email: email })

    return !!byEmail || !!byLogin
  }
  public async updateConfirmationCode(id: string, code: string, newExpirationDate: Date) {
    try {

      const result: UpdateWriteOpResult = await this.userModel.updateOne({ _id: new ObjectId(id) }, {$set: {'emailConfirmation.confirmationCode': code, 'emailConfirmation.expirationDate': newExpirationDate}})

      return result.modifiedCount ? result.modifiedCount : null

    } catch (e) {

      console.error(e)

      return null

    }
  }
  async getUserByConfirmCode(code: string): Promise<WithId<UserDbType> | null> {
    try {

      return await this.userModel.findOne({'emailConfirmation.confirmationCode': code})

    } catch (e) {

      console.error(e)

      return null

    }
  }
  async confirmEmail(id: string): Promise<boolean> {
    try {

      const result: UpdateWriteOpResult = await this.userModel.updateOne({_id: new ObjectId(id)}, {$set: {'emailConfirmation.isConfirmed': true}})

      return !!result.modifiedCount

    } catch (e) {

      console.error(e)

      return false

    }

  }
  public async findByLoginOrEmail(loginOrEmail): Promise<WithId<UserDbType> | null> {
    const result = await this.userModel.findOne({
      $or: [
        {login: loginOrEmail},
        {email: loginOrEmail}
      ]
    }) as WithId<UserDbType>

    if (result) {
      return result
    } else {
      return null
    }
  }
  async getUserByRecoveryCode(code: string): Promise<WithId<UserDbType> | null> {
    try {

      return await await this.userModel.findOne({'emailConfirmation.recoveryCode': code})

    } catch (e) {

      console.error(e)

      return null

    }
  }
  async updatePassword(userId: string, password: string): Promise<boolean> {
    try {
      const result: UpdateWriteOpResult = await this.userModel.updateOne({_id: new ObjectId(userId)}, {$set: {password: password}})

      return !!result.modifiedCount

    } catch (e) {
      console.error(e)

      return false
    }

  }
  async updateRecoveryCode(userId: string, code: string, newExpirationDate: Date) {
    try {

      const result: UpdateWriteOpResult = await this.userModel.updateOne({ _id: new ObjectId(userId) }, {$set: {'emailConfirmation.recoveryCode': code, 'emailConfirmation.expirationRecoveryDate': newExpirationDate}})

      return result.modifiedCount ? result.modifiedCount : null

    } catch (e) {
      console.error(e)

      return null
    }
  }
}
