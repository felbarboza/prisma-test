import { CreateBlogDTO } from "../dtos/CreateBlogDTO";
import { Blog } from "../models/Blog";
import { BaseRepository } from "./BaseRepository";
import { client as DBConn } from "../db";
import { CreatePostDTO } from "../dtos/CreatePostDTO";
import { Post } from "../models/Post";
import {
  insertBlogQuery,
  insertPostQuery,
  findBlogBySlugQuery,
  findBlogByIdQuery,
  findBlogWithPostsBySlug,
  findBlogWithPostsById,
} from "./queries.sql";
import { DuplicatedBlogError } from "../errors/DuplicatedBlogError";
import { Logger } from "winston";
import { DBError } from "../errors/DBError";
import { DBNotFoundError } from "../errors/DBNotFoundError";

export class PostgresRepository implements BaseRepository {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async createBlog(blog: CreateBlogDTO): Promise<Blog> {
    const client = await DBConn.connect();
    try {
      this.logger.info("PostgresRepository: Starting transaction to create blog", { blog });
      await client.query("BEGIN");
      const blogResult = await client.query(insertBlogQuery, [blog.name, blog.slug]);
      const createdBlog = blogResult.rows[0] as Blog;

      if (blog.posts && blog.posts.length > 0) {
        for (const post of blog.posts) {
          await client.query(insertPostQuery, [post.title, post.content, createdBlog.id]);
        }
      }

      await client.query("COMMIT");
      this.logger.info("PostgresRepository: Transaction committed successfully");
      return createdBlog;

    } catch (error: any) {
      await client.query("ROLLBACK");
      this.logger.error("PostgresRepository: Error creating blog and posts", {error});

      if (error.code === "23505") {
        throw new DuplicatedBlogError();
      }

      throw new DBError("Error creating blog and posts");

    } finally {
      client.release();
    }
  }

  async createPost(post: CreatePostDTO, blogId: number): Promise<Post> {
    const client = await DBConn.connect();
    try {
      this.logger.info("PostgresRepository: Creating post", { post, blogId });
      const blogResult = await client.query(findBlogByIdQuery, [blogId]);

      if (blogResult.rows.length === 0) {
        this.logger.warn("PostgresRepository: Blog not found for post creation", { blogId });
        throw new DBNotFoundError("Blog not found");
      }

      const postResult = await client.query(insertPostQuery, [post.title, post.content, blogId]);
      const createdPost = postResult.rows[0] as Post;
      this.logger.info("PostgresRepository: Post created successfully", { createdPost });
      return createdPost;

    } catch (error) {
      this.logger.error("PostgresRepository: Error creating post", { error });
      throw new DBError("Error creating post");

    } finally {
      client.release();
    }
  }

  async getBlogBySlug(
    slug: string,
    includePosts: boolean,
  ): Promise<Blog | null> {
    const client = await DBConn.connect();
    try {
      this.logger.info("PostgresRepository: Fetching blog by slug", { slug, includePosts });
      let blogResult;

      if (includePosts) {
        blogResult = await client.query(findBlogWithPostsBySlug, [slug]);
      } else {
        blogResult = await client.query(findBlogBySlugQuery, [slug]);
      }

      if (blogResult.rows.length === 0) {
        this.logger.warn("PostgresRepository: Blog not found", { slug });
        return null;
      }

      const blog: Blog = {
        id: blogResult.rows[0].blog_id,
        name: blogResult.rows[0].blog_name,
        slug: blogResult.rows[0].blog_slug,
        posts: [],
      };

      if (includePosts) {
        const posts: Post[] = blogResult.rows.map((row) => ({
          id: row.post_id,
          title: row.post_title,
          content: row.post_content,
          viewCount: row.post_view_count,
        }));
        blog.posts = posts;
      }

      return blog;
    } catch (error) {
      this.logger.error("PostgresRepository: Error fetching blog by slug", { slug, error });
      throw new DBError("Error getting blogs");
    } finally {
      client.release();
    }
  }

  async getBlogById(id: number, includePosts: boolean): Promise<Blog | null> {
    const client = await DBConn.connect();
    try {
      this.logger.info("PostgresRepository: Fetching blog by ID", { id, includePosts });
      let blogResult;
      if (includePosts) {
        blogResult = await client.query(findBlogWithPostsById, [id]);
      } else {
        blogResult = await client.query(findBlogByIdQuery, [id]);
      }

      if (blogResult.rows.length === 0) {
        this.logger.warn("PostgresRepository: Blog not found", { id });
        return null;
      }

      const blog: Blog = {
        id: blogResult.rows[0].blog_id,
        name: blogResult.rows[0].blog_name,
        slug: blogResult.rows[0].blog_slug,
        posts: [],
      };

      if (includePosts) {
        const posts: Post[] = blogResult.rows.map((row) => ({
          id: row.post_id,
          title: row.post_title,
          content: row.post_content,
          viewCount: row.post_view_count,
        }));
        blog.posts = posts;
      }

      return blog;
    } catch (error) {
      this.logger.error("PostgresRepository: Error fetching blog by ID", { id, error });
      throw new DBError("Error getting blogs");
    } finally {
      client.release();
    }
  }
}
