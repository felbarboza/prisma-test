import { CreateBlogDTO } from "src/dtos/CreateBlogDTO";
import { BaseRepository } from "../repositories/BaseRepository";
import { Blog } from "src/models/Blog";
import { Logger } from "winston";

export class BlogService {
  private repository: BaseRepository;
  private logger: Logger;

  constructor(repository: BaseRepository, logger: Logger) {
    this.repository = repository;
    this.logger = logger;
  }

  async createBlog(blog: CreateBlogDTO): Promise<Blog | Error> {
    this.logger.info("BlogService: Creating blog", blog);
    return this.repository.createBlog(blog);
  }

  async getBlogBySlug(slug: string, includePosts: boolean): Promise<Blog | null> {
    this.logger.info("BlogService: Getting blog", slug, includePosts);

    const blog = await this.repository.getBlogBySlug(slug, includePosts);

    return blog;
  }

  async getBlogById(id: number, includePosts: boolean): Promise<Blog | null> {
    this.logger.info("BlogService: Getting blog", id, includePosts);

    const blog = await this.repository.getBlogById(id, includePosts);

    return blog;
  }
}
