import { PostService } from "../PostService";
import { FakeRepository } from "./FakeRepository";
import { Logger } from "winston";
import { CreatePostDTO } from "src/dtos/CreatePostDTO";
import { Blog } from "src/models/Blog";

const mockLogger: Logger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
} as unknown as Logger;

describe("PostService", () => {
  let postService: PostService;
  let fakeRepository: FakeRepository;

  beforeEach(() => {
    fakeRepository = new FakeRepository();
    postService = new PostService(fakeRepository, mockLogger);
  });

  it("should create a post", async () => {
    const blogDTO = {
      name: "Test Blog",
      slug: "test-blog",
      posts: [],
    };

    const createdBlog: Blog = await fakeRepository.createBlog(blogDTO);

    const postDTO: CreatePostDTO = {
      title: "Test Post",
      content: "This is a test post.",
    };

    const result = await postService.createPost(postDTO, createdBlog.id);

    expect(result).toEqual({
      id: 0,
      title: postDTO.title,
      content: postDTO.content,
      viewCount: 0,
    });
  });

  it("should return an error for creating a post in non-existent blog", async () => {
    const postDTO: CreatePostDTO = {
      title: "Test Post",
      content: "This is a test post.",
    };
    await expect(postService.createPost(postDTO, 999)).rejects.toBeInstanceOf(Error)
  });
});
