import { ApplicationError } from "./ApplicationError";

export class DBError extends ApplicationError {
  constructor(message: string) {
    super();
    this.message = message;
    this.errCode = 400;
  }
}
