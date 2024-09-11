import { Post } from "./Post";

export interface Blog {
  id: number;
  name: string;
  slug: string;
  posts: Post[];
}
