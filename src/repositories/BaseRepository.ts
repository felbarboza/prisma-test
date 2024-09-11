import { CreateBlogDTO } from "../dtos/CreateBlogDTO";
import { CreatePostDTO } from "../dtos/CreatePostDTO";
import { Blog } from "../models/Blog";
import { Post } from "../models/Post";

export interface BaseRepository {
  createBlog(blog: CreateBlogDTO): Promise<Blog>;
  createPost(post: CreatePostDTO, blogId: number): Promise<Post>;
  getBlogById(id: number, includePosts: boolean): Promise<Blog | null>;
  getBlogBySlug(slug: string, includePosts: boolean): Promise<Blog | null>;
}
