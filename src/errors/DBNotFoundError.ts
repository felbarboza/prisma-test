import { ApplicationError } from "./ApplicationError";

export class DBNotFoundError extends ApplicationError {
  constructor(message: string) {
    super();
    this.message = message;
    this.errCode = 404;
  }
}
