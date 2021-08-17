import express from "express";

import ***REMOVED*** verifyAccessToken ***REMOVED*** from "../utils/jwt.js";
import ***REMOVED***
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
***REMOVED*** from "../controllers/posts.js";

const postsRoute = express.Router();

postsRoute.get("/", (req, res) => ***REMOVED***
  res.status(200).send("Welcome");
***REMOVED***);

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

