import { CreateBlogDTO } from "src/dtos/CreateBlogDTO";
import { Blog } from "src/models/Blog";
import { BaseRepository } from "../../repositories/BaseRepository";
import { CreatePostDTO } from "src/dtos/CreatePostDTO";
import { Post } from "src/models/Post";

export class FakeRepository implements BaseRepository {
    private blogs: Blog[] = [];
    private postNum = 0;

    async createBlog(blogReq: CreateBlogDTO): Promise<Blog> {
        const alreadyHasSlug = this.blogs.findIndex((blog) => blog.slug === blogReq.slug);

        if (alreadyHasSlug !== -1) {
            return Promise.reject(new Error("Blog with this slug already exists."));
        }

        const newId = this.blogs.length + 1;

        const createdBlog: Blog = {
            id: newId,
            name: blogReq.name,
            slug: blogReq.slug,
            posts: []
        };

        this.blogs.push(createdBlog);

        const posts: Post[] = blogReq.posts.map((post) => {
            const postId = this.postNum;
            this.postNum += 1;
            return {
                id: postId,
                title: post.title,
                content: post.content,
                viewCount: 0
            };
        });

        createdBlog.posts = posts;

        return Promise.resolve(createdBlog);
    }

    async createPost(post: CreatePostDTO, blogId: number): Promise<Post> {
        const blog = this.blogs.find(b => b.id === blogId);

        if (!blog) {
            return Promise.reject(new Error("Blog not found."));
        }

        const newPostId = this.postNum;
        this.postNum += 1;

        const newPost: Post = {
            id: newPostId,
            title: post.title,
            content: post.content,
            viewCount: 0
        };

        blog.posts.push(newPost);

        return Promise.resolve(newPost);
    }

    async getBlogById(id: number, includePosts: boolean): Promise<Blog | null> {
        const blog = this.blogs.find(b => b.id === id);

        if (!blog) {
            return Promise.resolve(null);
        }

        if (includePosts) {
            return Promise.resolve(blog);
        } else {
            return Promise.resolve({
                ...blog,
                posts: []
            });
        }
    }

    async getBlogBySlug(slug: string, includePosts: boolean): Promise<Blog | null> {
        const blog = this.blogs.find(b => b.slug === slug);

        if (!blog) {
            return Promise.resolve(null);
        }

        if (includePosts) {
            return Promise.resolve(blog);
        } else {
            return Promise.resolve({
                ...blog,
                posts: []
            });
        }
    }
}
