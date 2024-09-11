import { BaseRepository } from "../repositories/BaseRepository";
import { CreatePostDTO } from "src/dtos/CreatePostDTO";
import { Post } from "src/models/Post";
import { Logger } from "winston";

export class PostService {
  private repository: BaseRepository;
  private logger: Logger;

  constructor(repository: BaseRepository, logger: Logger) {
    this.repository = repository;
    this.logger = logger;
  }

  async createPost(
    postDTO: CreatePostDTO,
    blogId: number,
  ): Promise<Post | Error> {
    return this.repository.createPost(postDTO, blogId);
  }
}
