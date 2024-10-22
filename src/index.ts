import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono().basePath("/api/v1");
app.use(
  cors({
    origin: "*",
  })
);


export default app;
