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
  fetchLikes,
  home,
  fetchFeed
***REMOVED*** from "../controllers/posts.js";

const postsRoute = express.Router();

postsRoute.get('/api/posts', home);
postsRoute.get("/api/posts/:id", verifyAccessToken, fetchPost);
postsRoute.get("/api/posts/feed/all", verifyAccessToken, fetchFeed);
postsRoute.patch("/api/posts/:id", verifyAccessToken, updatePost);
postsRoute.get('/api/posts/:id/comments', verifyAccessToken, fetchPostComments);
postsRoute.post("/api/posts/new", verifyAccessToken, createPost);
postsRoute.get("/api/posts/users/:id/fetchPosts", verifyAccessToken, fetchUserPosts);
postsRoute.get("/api/posts/users/:id/fetchLikedPosts", verifyAccessToken, fetchLikedPosts);
postsRoute.get("/api/posts/:id/likes", verifyAccessToken, fetchLikes); //post likes
postsRoute.post("/api/posts/:id/like", verifyAccessToken, likePost);
postsRoute.delete("/api/posts/:id/unlike", verifyAccessToken, unLikePost);
postsRoute.post("/api/posts/:id/comment/new", verifyAccessToken, createComment);
export default postsRoute;

