// Core
import express from "express";
import cors from "cors";

// Controllers (or routes in this context!)
import postController from "./post/post.controller";
import favoritesController from "./favorites/favorites.controller";

export function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.get("/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/posts", postController);
  app.use("/favorites", favoritesController);

  return app;
}
