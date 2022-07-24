import { Model, ModelObject } from "objection";

export class PostModel extends Model {
  // board!: string;
  thread?: number | string;
  subject!: string;
  email!: string;
  name!: string;
  comment!: string;
  created?: string;
  sage?: boolean;
  bump?: number;
  post!: number;
  password?: string;
  file?: string | null;
  fileOrig?: string | null;
  fileSize?: number | null;
  fileWidth?: string | null;
  fileHeight?: string | null;

  static tableName = 'posts_b';
  static idColumn = 'post';
}

export type PostShape = ModelObject<PostModel>