// Core
import { Router } from "express";

// Services
import { listPosts, getPost } from "./post.service";

// DTOs
import { PostResponseList } from "./dto/post-response.dto";


const postController = Router();

postController.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const posts: PostResponseList = await listPosts(
      Number(page),
      Number(limit),
    );
    res.json(posts);
  } catch (error) {
    console.error("Error listing posts:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});
postController.get("/:id", async (req, res) => {
  try {
    const post = await getPost(Number(req.params.id));
    res.json(post);
  } catch (error) {
    console.error(`Error getting post with id ${req.params.id}:`, error);
    res.status(500).json({ message: "Error fetching post" });
  }
});

export default postController;