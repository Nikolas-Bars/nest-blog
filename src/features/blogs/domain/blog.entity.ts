import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BlogModelType = Model<BlogDocument>;

export type BlogDocument = HydratedDocument<Blog>

@Schema()
export class Blog {
  @Prop()
  name: string

  @Prop()
  description: string

  @Prop()
  websiteUrl: string

  @Prop()
  isMemberShip: boolean

  @Prop()
  createdAt: Date
}

export const BlogSchema = SchemaFactory.createForClass(Blog)

