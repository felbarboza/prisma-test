import { BlogService } from "../BlogService";
import { FakeRepository } from "./FakeRepository";
import { Logger } from "winston";
import { CreateBlogDTO } from "src/dtos/CreateBlogDTO";

const mockLogger: Logger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
} as unknown as Logger;

describe("BlogService", () => {
  let blogService: BlogService;
  let fakeRepository: FakeRepository;

  beforeEach(() => {
    fakeRepository = new FakeRepository();
    blogService = new BlogService(fakeRepository, mockLogger);
  });

  it("should create a blog", async () => {
    const blogDTO: CreateBlogDTO = {
      name: "Test Blog",
      slug: "test-blog",
      posts: [],
    };

    const result = await blogService.createBlog(blogDTO);

    expect(result).toEqual({
      id: 1,
      name: blogDTO.name,
      slug: blogDTO.slug,
      posts: [],
    });
  });

  it("should get a blog by slug", async () => {
    const blogDTO: CreateBlogDTO = {
      name: "Test Blog",
      slug: "test-blog",
      posts: [],
    };

    await blogService.createBlog(blogDTO);

    const result = await blogService.getBlogBySlug("test-blog", false);

    expect(result).toEqual({
      id: 1,
      name: blogDTO.name,
      slug: blogDTO.slug,
      posts: [],
    });
  });

  it("should return null for non-existent blog by slug", async () => {
    const result = await blogService.getBlogBySlug("non-existent-blog", false);
    expect(result).toBeNull();
  });

  it("should get a blog by ID", async () => {
    const blogDTO: CreateBlogDTO = {
      name: "Test Blog",
      slug: "test-blog",
      posts: [],
    };

    await blogService.createBlog(blogDTO);

    const result = await blogService.getBlogById(1, false);

    expect(result).toEqual({
      id: 1,
      name: blogDTO.name,
      slug: blogDTO.slug,
      posts: [],
    });
  });

  it("should return null for non-existent blog by ID", async () => {
    const result = await blogService.getBlogById(999, false);
    expect(result).toBeNull();
  });
});
