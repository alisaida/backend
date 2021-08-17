import express from "express";

import { verifyAccessToken } from "../utils/jwt.js";
import {
  createPost,
  fetchUserPosts,
  fetchPost,
  updatePost,
  createComment,
  fetchPostComments,
  likePost,
  unLikePost,
  fetchLikedPosts,
  fetchLikes
} from "../controllers/posts.js";

const postsRoute = express.Router();

postsRoute.get("/", (req, res) => {
  res.status(200).send("Welcome");
});

postsRoute.get("/posts/:id", verifyAccessToken, fetchPost);
postsRoute.patch("/posts/:id", verifyAccessToken, updatePost);
postsRoute.get('/posts/:id/comments', verifyAccessToken, fetchPostComments);
postsRoute.post("/posts/new", verifyAccessToken, createPost);
postsRoute.get("/users/:id/posts", verifyAccessToken, fetchUserPosts);
postsRoute.get("/posts-likes", verifyAccessToken, fetchLikedPosts); //auth user likes
postsRoute.get("/posts/:id/likes", verifyAccessToken, fetchLikes); //post likes
postsRoute.post("/posts/:id/like", verifyAccessToken, likePost);
postsRoute.delete("/posts/:id/unlike", verifyAccessToken, unLikePost);
postsRoute.post("/posts/:id/comment/new", verifyAccessToken, createComment);
export default postsRoute;

