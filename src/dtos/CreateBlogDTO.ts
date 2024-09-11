import { CreatePostDTO } from "./CreatePostDTO";

export interface CreateBlogDTO {
  name: string;
  slug: string;
  posts: CreatePostDTO[];
}
