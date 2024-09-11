import express, { NextFunction, Request, Response, Router } from "express";
import { CreateBlogDTO } from "./dtos/CreateBlogDTO";
import { CreatePostDTO } from "./dtos/CreatePostDTO";
import { Dependencies } from "./dependencies";
import { createBlogValidator } from "./validators/CreateBlogValidator";
import { createPostValidator } from "./validators/CreatePostValidator";
import { JoiValidationError } from "./errors/JoiValidationError";
import {
  getBlogByIdSchema,
  getBlogBySlugSchema,
} from "./validators/GetBlogValidator";
import { Logger } from "winston";

export class Controller {
  public router: Router;
  private dependencies: Dependencies;
  private logger: Logger;

  constructor(logger: Logger) {
    this.router = express.Router();
    this.dependencies = new Dependencies(logger);
    this.logger = logger;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/blogs", this.createBlog.bind(this));
    this.router.get("/blogs/slug/:slug", this.getBlogBySlug.bind(this));
    this.router.get("/blogs/:id", this.getBlogById.bind(this));
    this.router.post("/posts", this.createPost.bind(this));
  }

  private async createBlog(req: Request, res: Response, next: NextFunction) {
    this.logger.debug("Incoming request for creating blog", req.body);
    try {
      const { error } = createBlogValidator.validate(req.body);

      if (error) {
        throw new JoiValidationError(`Validation error: ${error.details.map((x) => x.message).join(", ")}`);
      }
      const blog: CreateBlogDTO = req.body;

      const newBlog = await this.dependencies.blogService.createBlog(blog);
      res.status(201).json(newBlog);
    } catch (err) {
      next(err);
    }
  }

  private async getBlogBySlug(req: Request, res: Response) {
    this.logger.debug("Incoming request for getting blogs", req);
    const slug = req.params.slug;

    const { error } = getBlogBySlugSchema.validate({ slug, includePosts: req.query.includePosts});

    if (error) {
      throw new JoiValidationError(`Validation error: ${error.details.map((x) => x.message).join(", ")}`);
    }
    const includePosts = req.query.includePosts === "true";

    const blog = await this.dependencies.blogService.getBlogBySlug(slug, includePosts);

    res.status(200).json(blog);
  }

  private async getBlogById(req: Request, res: Response, next: NextFunction) {
    try {
      this.logger.debug("Incoming request for getting blogs", req);
      const id = req.params.id;

      const { error } = getBlogByIdSchema.validate({ id, includePosts: req.query.includePosts });

      if (error) {
        throw new JoiValidationError(`Validation error: ${error.details.map((x) => x.message).join(", ")}`);
      }

      const includePosts = req.query.includePosts === "true";

      const blog = await this.dependencies.blogService.getBlogById(Number(id), includePosts);

      res.status(200).json(blog);
    } catch (err) {
      next(err);
    }
  }

  private async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      this.logger.debug("Incoming request for creating post", req);
      const { error } = createPostValidator.validate(req.body);

      if (error) {
        throw new JoiValidationError(`Validation error: ${error.details.map((x) => x.message).join(", ")}`);
      }

      const post: CreatePostDTO = req.body;
      const blogId = req.body.blogId;

      const newPost = await this.dependencies.postService.createPost(post, Number(blogId));

      res.status(201).json(newPost);
    } catch (err) {
      next(err);
    }
  }
}
