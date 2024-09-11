import { ApplicationError } from "./ApplicationError";

export class DuplicatedBlogError extends ApplicationError {
  constructor() {
    super();
    this.message = "Slug already exists";
    this.errCode = 409;
  }
}
