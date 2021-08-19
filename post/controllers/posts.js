import httpError from "http-errors";
import mongoose from "mongoose";

import Post from "../models/posts.js";
import User from "../models/users.js";
import Like from "../models/likes.js";
import Comment from "../models/comments.js";
/**
 * fetch post by id, with comments and likes
 * @param ***REMOVED*******REMOVED*** req
 * @param ***REMOVED*******REMOVED*** res
 * @param ***REMOVED*******REMOVED*** next
 */
export const fetchPost = async (req, res, next) => ***REMOVED***
  const postId = req.params.id;
  if (!postId) ***REMOVED***
    httpError.BadRequest();
  ***REMOVED***
  try ***REMOVED***
    const post = await Post.findOne(***REMOVED*** _id: postId ***REMOVED***);
    if (!post) ***REMOVED***
      httpError.NotFound();
    ***REMOVED***

    const comments = await getCommentsForPostHelperFn(postId, next);
    const likes = await fetchLikesHelperFn(postId, next);

    const postObj = ***REMOVED***
      post: post,
      comments: comments,
      likes: likes
    ***REMOVED***

    res.status(200).send(postObj);
  ***REMOVED*** catch (error) ***REMOVED***
    next(error);
  ***REMOVED***
***REMOVED***;

/**
 * fetch all posts by user
 * @param ***REMOVED*******REMOVED*** req
 * @param ***REMOVED*******REMOVED*** res
 * @param ***REMOVED*******REMOVED*** next
 */
export const fetchUserPosts = async (req, res, next) => ***REMOVED***
  const userId = req.params.id;
  if (!userId) ***REMOVED***
    throw httpError.BadRequest();
  ***REMOVED***

  try ***REMOVED***
    const doesExist = await User.findOne(***REMOVED*** userId: userId ***REMOVED***);

    if (!doesExist) ***REMOVED***
      throw httpError.NotFound();
    ***REMOVED***

    const posts = await Post.find(***REMOVED*** userId: userId ***REMOVED***);

    res.status(200).send(posts);
  ***REMOVED*** catch (error) ***REMOVED***
    next(error);
  ***REMOVED***
***REMOVED***;

/**
 * fetch comments by postId
 * @param ***REMOVED*******REMOVED*** req 
 * @param ***REMOVED*******REMOVED*** res 
 * @param ***REMOVED*******REMOVED*** next 
 */
export const fetchPostComments = async (req, res, next) => ***REMOVED***
  const postId = req.params.id;
  if (!postId) ***REMOVED***
    httpError.BadRequest();
  ***REMOVED***
  try ***REMOVED***
    const post = await Post.findOne(***REMOVED*** _id: postId ***REMOVED***);
    if (!post) ***REMOVED***
      httpError.NotFound();
    ***REMOVED***

    const comments = await getCommentsForPostHelperFn(postId, next);

    res.status(200).send(comments);
  ***REMOVED*** catch (error) ***REMOVED***
    next(error);
  ***REMOVED***
***REMOVED***

/**
 * create new comment
 * @param ***REMOVED*******REMOVED*** req 
 * @param ***REMOVED*******REMOVED*** res 
 * @param ***REMOVED*******REMOVED*** next 
 */
export const createComment = async (req, res, next) => ***REMOVED***
  const postId = req.params.id;
  const userId = req.authUser;
  const ***REMOVED*** comment ***REMOVED*** = req.body;

  if (!postId || !comment) ***REMOVED***
    throw httpError.BadRequest();
  ***REMOVED***

  try ***REMOVED***
    const doesExist = await Post.find(***REMOVED*** _id: postId ***REMOVED***);
    if (!doesExist) ***REMOVED***
      throw httpError.NotFound();
    ***REMOVED***

    //comment obj
    const commentObj = new Comment(***REMOVED***
      postId: postId,
      userId: userId,
      comment: comment,
    ***REMOVED***);

    await commentObj.save();
    res.status(201).send("Comment created");
  ***REMOVED*** catch (error) ***REMOVED***
    next(error);
  ***REMOVED***
***REMOVED***;

/**
 * creates a new post
 * @param ***REMOVED*******REMOVED*** req
 * @param ***REMOVED*******REMOVED*** res
 * @param ***REMOVED*******REMOVED*** next
 */
export const createPost = async (req, res, next) => ***REMOVED***
  const userId = req.authUser;

  const ***REMOVED*** content, imageUri ***REMOVED*** = req.body;

  try ***REMOVED***
    const post = new Post(***REMOVED***
      userId: userId,
      content: content,
      imageUri: imageUri,
    ***REMOVED***);

    const savedPost = await post.save();

    if (!savedPost) ***REMOVED***
      throw httpError.InternalServerError();
    ***REMOVED***
    res.status(201).send();
  ***REMOVED*** catch (error) ***REMOVED***
    next(error);
  ***REMOVED***
***REMOVED***;

/**
 * update post
 * @param ***REMOVED*******REMOVED*** req
 * @param ***REMOVED*******REMOVED*** res
 * @param ***REMOVED*******REMOVED*** next
 */
export const updatePost = async (req, res, next) => ***REMOVED***
  const postId = req.params.id;
  const ***REMOVED*** content, imageUri ***REMOVED*** = req.body;

  try ***REMOVED***
    if (!postId && !content && !imageUri) ***REMOVED***
      throw httpError.BadRequest('postId not provided');
    ***REMOVED***

    if (!postId && !content && !imageUri) ***REMOVED***
      throw httpError.BadRequest('nothing to update');
    ***REMOVED***

    await Post.findOneAndUpdate(
      ***REMOVED*** _id: postId ***REMOVED***,
      ***REMOVED***
        $set: ***REMOVED***
          content: content,
          imageUri: imageUri,
          updatedAt: new Date()
        ***REMOVED***
      ***REMOVED***
      , ***REMOVED***
        upsert: true
      ***REMOVED***
    );

    res.status(200).send('Post updated successfully');
  ***REMOVED*** catch (error) ***REMOVED***
    next(error)
  ***REMOVED***
***REMOVED***

/** 
 * like post
 * @param ***REMOVED*******REMOVED*** req 
 * @param ***REMOVED*******REMOVED*** res 
 * @param ***REMOVED*******REMOVED*** next 
 */
export const likePost = async (req, res, next) => ***REMOVED***
  const postId = req.params.id;
  const userId = req.authUser;
  if (!postId) ***REMOVED***
    throw httpError.BadRequest();
  ***REMOVED***
  try ***REMOVED***

    const exists = await Like.findOne(***REMOVED*** postId: postId, userId: userId ***REMOVED***);
    if (exists) ***REMOVED***
      throw httpError.Conflict();
    ***REMOVED***
    const likes = new Like(***REMOVED*** postId: postId, userId: userId ***REMOVED***);
    await likes.save();

    res.status(201).send('Post liked');
  ***REMOVED*** catch (error) ***REMOVED***
    next(error);
  ***REMOVED***
***REMOVED***;

/** 
 * unlike post
 * @param ***REMOVED*******REMOVED*** req 
 * @param ***REMOVED*******REMOVED*** res 
 * @param ***REMOVED*******REMOVED*** next 
 */
export const unLikePost = async (req, res, next) => ***REMOVED***
  const postId = req.params.id;
  const userId = req.authUser;
  if (!postId) ***REMOVED***
    throw httpError.BadRequest();
  ***REMOVED***
  try ***REMOVED***

    const like = await Like.findOne(***REMOVED*** postId: postId, userId: userId ***REMOVED***);
    if (!like) ***REMOVED***
      throw httpError.NotFound();
    ***REMOVED***

    await like.delete();

    res.status(201).send('Post unliked');
  ***REMOVED*** catch (error) ***REMOVED***
    next(error);
  ***REMOVED***
***REMOVED***;

/**
 * fetch posts liked by user
 * @param ***REMOVED*******REMOVED*** req
 * @param ***REMOVED*******REMOVED*** res
 * @param ***REMOVED*******REMOVED*** next
 */
export const fetchLikedPosts = async (req, res, next) => ***REMOVED***
  const userId = req.params.id;

  try ***REMOVED***
    if (!userId) ***REMOVED***
      throw httpError.BadRequest();
    ***REMOVED***
    const likedPosts = await Like.find(***REMOVED*** userId: userId ***REMOVED***);
    const postIds = likedPosts.map(likedPost => likedPost.postId);
    const likes = await Post.find(***REMOVED*** _id: ***REMOVED*** $in: postIds ***REMOVED*** ***REMOVED***);

    res.status(200).send(likes);
  ***REMOVED*** catch (error) ***REMOVED***
    next(error);
  ***REMOVED***
***REMOVED***;

/**
 * fetch post likes
 * @param ***REMOVED*******REMOVED*** req
 * @param ***REMOVED*******REMOVED*** res
 * @param ***REMOVED*******REMOVED*** next
 */
export const fetchLikes = async (req, res, next) => ***REMOVED***
  const postId = req.params.id;
  if (!postId) ***REMOVED***
    throw httpError.BadRequest();
  ***REMOVED***

  try ***REMOVED***
    const exist = await Post.findOne(***REMOVED*** _id: postId ***REMOVED***);
    if (!exist) ***REMOVED***
      throw httpError.NotFound();
    ***REMOVED***

    const likes = await fetchLikesHelperFn(postId, next);

    res.status(200).send(likes);
  ***REMOVED*** catch (error) ***REMOVED***
    next(error);
  ***REMOVED***
***REMOVED***;

/**
 *helper function to get comments for post 
 * @param ***REMOVED*******REMOVED*** postId 
 * @param ***REMOVED*******REMOVED*** next
 */
const getCommentsForPostHelperFn = async (postId, next) => ***REMOVED***
  try ***REMOVED***
    const postComments = await Comment.find(***REMOVED*** postId: postId ***REMOVED***);
    return postComments;
  ***REMOVED*** catch (error) ***REMOVED***
    next(error);
  ***REMOVED***
***REMOVED***;

/**
 * helper function to retreive likes for post
 * @param ***REMOVED*******REMOVED*** postId
 * @param ***REMOVED*******REMOVED*** next
 */
const fetchLikesHelperFn = async (postId, next) => ***REMOVED***
  try ***REMOVED***

    const likes = await Like.find(***REMOVED*** postId: postId ***REMOVED***);
    const result = likes.map(likedPost => (***REMOVED*** _id: likedPost._id, userId: likedPost.userId ***REMOVED***));

    return result;
  ***REMOVED*** catch (error) ***REMOVED***
    next(error);
  ***REMOVED***
***REMOVED***;