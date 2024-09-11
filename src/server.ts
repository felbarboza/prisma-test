import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, Express, NextFunction } from "express";
import winston from "winston";
import cors from "cors";
import rateLimiter from "./middlewares/RateLimiter";
import { ApplicationError } from "./errors/ApplicationError";
import { Controller } from "./routes";

const app: Express = express();
const port = process.env.PORT || 3333;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.colorize(),
  ),
  transports: [new winston.transports.Console()],
  defaultMeta: { service: "prisma-test" },
});

app.use(cors());
app.use(rateLimiter);
app.use(express.json());

const controller = new Controller(logger);

app.use("/api/v1", controller.router);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof ApplicationError) {
    logger.error("Application error", err);
    return response.status(err.errCode).json({
      status: "error",
      message: err.message,
    });
  }

  logger.error("Unexpected error", err);

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

app.listen(port, () => {
  logger.info(`Server started on port:${port}`);
});
