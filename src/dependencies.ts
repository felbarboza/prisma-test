import { Logger } from "winston";
import { PostgresRepository } from "./repositories/PostgresRepository";
import { BlogService } from "./services/BlogService";
import { PostService } from "./services/PostService";

export class Dependencies {
  public postService: PostService;
  public blogService: BlogService;

  constructor(logger: Logger) {
    const repository = new PostgresRepository(logger);
    this.postService = new PostService(repository, logger);
    this.blogService = new BlogService(repository, logger);
  }
}
