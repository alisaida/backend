import express from "express";

import ***REMOVED*** verifyAccessToken ***REMOVED*** from "../utils/jwt.js";
import ***REMOVED*** home, fetchFeed, fetchPost, fetchUserPosts, createPost, updatePost, fetchPostComments, createComment, fetchLikes, fetchLikedPosts, likePost, unLikePost, isLiked, fetchBookmarkedPosts, bookmarkPost, unBookmarkPost, isBookmarked ***REMOVED*** from "../controllers/posts.js";

const postsRoute = express.Router();

postsRoute.get('/api/posts', home);
postsRoute.get("/api/posts/feed/all", verifyAccessToken, fetchFeed);
postsRoute.get("/api/posts/:id", verifyAccessToken, fetchPost);
postsRoute.get("/api/posts/users/:id/fetchPosts", verifyAccessToken, fetchUserPosts);
postsRoute.post("/api/posts/new", verifyAccessToken, createPost);
postsRoute.patch("/api/posts/:id", verifyAccessToken, updatePost);
postsRoute.post("/api/posts/:id/comment/new", verifyAccessToken, createComment);
postsRoute.get('/api/posts/:id/comments', verifyAccessToken, fetchPostComments);
postsRoute.get("/api/posts/:id/likes", verifyAccessToken, fetchLikes);
postsRoute.get("/api/posts/likes/me", verifyAccessToken, fetchLikedPosts);
postsRoute.post("/api/posts/:id/like", verifyAccessToken, likePost);
postsRoute.delete("/api/posts/:id/like", verifyAccessToken, unLikePost);
postsRoute.get("/api/posts/:id/likes/me", verifyAccessToken, isLiked);
postsRoute.get("/api/posts/bookmarks/me", verifyAccessToken, fetchBookmarkedPosts);
postsRoute.post("/api/posts/:id/bookmark", verifyAccessToken, bookmarkPost);
postsRoute.delete("/api/posts/:id/bookmark", verifyAccessToken, unBookmarkPost);
postsRoute.get("/api/posts/:id/bookmarks/me", verifyAccessToken, isBookmarked);

export default postsRoute;

