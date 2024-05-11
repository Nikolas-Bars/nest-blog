import { BlogDocument } from '../../../domain/blog.entity';


export class BlogOutputModel {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMemberShip: boolean;
}

// MAPPERS

export const BlogOutputModelMapper = (blog: BlogDocument): BlogOutputModel => {
  const outputModel = new BlogOutputModel();

  outputModel.id = blog.id;
  outputModel.name = blog.name;
  outputModel.createdAt = blog.createdAt
  outputModel.description = blog.description;
  outputModel.websiteUrl = blog.websiteUrl;
  outputModel.isMemberShip = blog.isMemberShip;

  return outputModel;
};