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
  fetchFeed,
  fetchBookmarkedPosts,
  bookmarkPost,
  unBookmarkPost
***REMOVED*** from "../controllers/posts.js";

const postsRoute = express.Router();

postsRoute.get('/api/posts', home);
postsRoute.get("/api/posts/:id", verifyAccessToken, fetchPost);
postsRoute.get("/api/posts/feed/all", verifyAccessToken, fetchFeed);
postsRoute.patch("/api/posts/:id", verifyAccessToken, updatePost);
postsRoute.get('/api/posts/:id/comments', verifyAccessToken, fetchPostComments);
postsRoute.post("/api/posts/new", verifyAccessToken, createPost);
postsRoute.get("/api/posts/users/:id/fetchPosts", verifyAccessToken, fetchUserPosts);
// postsRoute.get("/api/posts/users/:id/fetchLikedPosts", verifyAccessToken, fetchLikedPosts); //potentially pointless
postsRoute.get("/api/posts/:id/likes", verifyAccessToken, fetchLikes); //post likes
postsRoute.post("/api/posts/:id/like", verifyAccessToken, likePost);
postsRoute.delete("/api/posts/:id/like", verifyAccessToken, unLikePost);
postsRoute.post("/api/posts/:id/comment/new", verifyAccessToken, createComment);

postsRoute.get("/api/posts/bookmarks/me", verifyAccessToken, fetchBookmarkedPosts);
postsRoute.post("/api/posts/:id/bookmark", verifyAccessToken, bookmarkPost);
postsRoute.delete("/api/posts/:id/bookmark", verifyAccessToken, unBookmarkPost);

export default postsRoute;

