import httpError from "http-errors";
import mongoose from "mongoose";

import Post from "../models/posts.js";
import User from "../models/users.js";
import Like from "../models/likes.js";
import Bookmark from "../models/bookmarks.js";
import Comment from "../models/comments.js";

/**
 * home
 * @param ***REMOVED*******REMOVED*** req 
 * @param ***REMOVED*******REMOVED*** res 
 * @param ***REMOVED*******REMOVED*** next 
 */
export const home = async (req, res, next) => ***REMOVED***
  res.send('Welcome!');
***REMOVED***

/**
 * fetch all posts
 * @param ***REMOVED*******REMOVED*** req
 * @param ***REMOVED*******REMOVED*** res
 * @param ***REMOVED*******REMOVED*** next
 */
export const fetchFeed = async (req, res, next) => ***REMOVED***
  try ***REMOVED***
    let ***REMOVED*** page, size ***REMOVED*** = req.query;

    if (!page) ***REMOVED***
      page = 1;
    ***REMOVED***

    if (!size) ***REMOVED***
      size = 12;
    ***REMOVED***

    const limit = parseInt(size);

    let options = ***REMOVED***
      sort: ***REMOVED*** createdAt: -1 ***REMOVED***,
      lean: true,
      page: page,
      limit: limit,
    ***REMOVED***;

    const data = await Post.paginate(***REMOVED******REMOVED***, options);
    const ***REMOVED*** docs, hasNextPage, nextPage, totalDocs ***REMOVED*** = data;

    const postIds = docs.map(post => post._id);

    const results = ***REMOVED***
      page,
      hasNextPage,
      nextPage,
      size,
      totalDocs,
      data: postIds
    ***REMOVED***

    res.status(200).send(results);
  ***REMOVED*** catch (error) ***REMOVED***
    next(error);
  ***REMOVED***
***REMOVED***;

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
    let post = await Post.findOne(***REMOVED*** _id: postId ***REMOVED***);
    if (!post) ***REMOVED***
      httpError.NotFound();
    ***REMOVED***

    const comments = await Comment.countDocuments(***REMOVED*** postId: postId ***REMOVED***).exec();
    const likes = await Like.countDocuments(***REMOVED*** postId: postId ***REMOVED***).exec();

    const data = ***REMOVED***
      _id: post._id,
      createdAt: post.createdAt,
      userId: post.userId,
      caption: post.caption,
      imageUri: post.imageUri,
      likes,
      comments
    ***REMOVED***
    res.status(200).send(***REMOVED*** data ***REMOVED***);
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

  try ***REMOVED***
    let ***REMOVED*** page, size ***REMOVED*** = req.query;

    if (!page) ***REMOVED***
      page = 1;
    ***REMOVED***

    if (!size) ***REMOVED***
      size = 12;
    ***REMOVED***

    const limit = parseInt(size);

    let options = ***REMOVED***
      sort: ***REMOVED*** createdAt: -1 ***REMOVED***,
      lean: true,
      page: page,
      limit: limit,
    ***REMOVED***;

    const userId = req.params.id;
    if (!userId) ***REMOVED***
      throw httpError.BadRequest('Payload is missing userId');
    ***REMOVED***

    const doesExist = await User.findOne(***REMOVED*** userId: userId ***REMOVED***);

    if (!doesExist) ***REMOVED***
      throw httpError.NotFound();
    ***REMOVED***

    const data = await Post.paginate(***REMOVED*** userId: userId ***REMOVED***, options);
    const ***REMOVED*** docs, hasNextPage, nextPage, totalDocs ***REMOVED*** = data;

    const posts = docs.map((post) => post._id);

    const results = ***REMOVED***
      page,
      hasNextPage,
      nextPage,
      size,
      totalDocs,
      data: posts
    ***REMOVED***

    res.status(200).send(results);
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
  try ***REMOVED***
    let ***REMOVED*** page, size ***REMOVED*** = req.query;
    if (!page) ***REMOVED***
      page = 1;
    ***REMOVED***

    if (!size) ***REMOVED***
      size = 10;
    ***REMOVED***

    const limit = parseInt(size);

    let options = ***REMOVED***
      sort: ***REMOVED*** createdAt: -1 ***REMOVED***,
      lean: true,
      page: page,
      limit: limit,
    ***REMOVED***;

    let ***REMOVED*** id ***REMOVED*** = req.params;

    if (!id) ***REMOVED***
      httpError.BadRequest();
    ***REMOVED***
    const post = await Post.findOne(***REMOVED*** _id: id ***REMOVED***);

    if (!post) ***REMOVED***
      httpError.NotFound();
    ***REMOVED***

    const data = await Comment.paginate(***REMOVED*** postId: id ***REMOVED***, options);

    const ***REMOVED*** docs, hasNextPage, nextPage, totalDocs ***REMOVED*** = data;

    const results = ***REMOVED***
      page,
      hasNextPage,
      nextPage,
      size,
      totalDocs,
      data: docs
    ***REMOVED***

    res.status(200).send(results);
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
      createdAt: new Date().toISOString()
    ***REMOVED***);

    const savedComment = await commentObj.save();

    if (!savedComment) ***REMOVED***
      throw httpError.InternalServerError();
    ***REMOVED***

    res.status(201).send(savedComment);
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

  const ***REMOVED*** caption, imageUri ***REMOVED*** = req.body;

  try ***REMOVED***

    if (!imageUri || imageUri === '') ***REMOVED***
      throw httpError.BadRequest('Image uri missing from the payload');
    ***REMOVED***

    const post = new Post(***REMOVED***
      userId: userId,
      caption: caption,
      imageUri: imageUri,
      createdAt: new Date().toISOString()
    ***REMOVED***);

    const savedPost = await post.save();

    if (!savedPost) ***REMOVED***
      throw httpError.InternalServerError();
    ***REMOVED***
    res.status(201).send(savedPost);
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
  const ***REMOVED*** caption, imageUri ***REMOVED*** = req.body;

  try ***REMOVED***
    if (!postId) ***REMOVED***
      throw httpError.BadRequest();
    ***REMOVED***
    else if (!caption && !imageUri) ***REMOVED***
      throw httpError.BadRequest('nothing to update');
    ***REMOVED***

    await Post.findOneAndUpdate(
      ***REMOVED*** _id: postId ***REMOVED***,
      ***REMOVED***
        $set: ***REMOVED***
          caption: caption,
          imageUri: imageUri,
          updatedAt: new Date().toISOString()
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

    res.status(200).send('Post unliked');
  ***REMOVED*** catch (error) ***REMOVED***
    next(error);
  ***REMOVED***
***REMOVED***;

/**
 * fetch posts liked by authUser
 * @param ***REMOVED*******REMOVED*** req
 * @param ***REMOVED*******REMOVED*** res
 * @param ***REMOVED*******REMOVED*** next
 */
export const fetchLikedPosts = async (req, res, next) => ***REMOVED***

  try ***REMOVED***
    let ***REMOVED*** page, size ***REMOVED*** = req.query;

    if (!page) ***REMOVED***
      page = 1;
    ***REMOVED***

    if (!size) ***REMOVED***
      size = 12;
    ***REMOVED***

    const limit = parseInt(size);
    let options = ***REMOVED***
      sort: ***REMOVED*** _id: -1 ***REMOVED***,
      lean: true,
      page: page,
      limit: limit,
    ***REMOVED***;

    const userId = req.authUser;

    const data = await Like.paginate(***REMOVED*** userId: userId ***REMOVED***, options);
    const ***REMOVED*** docs, hasNextPage, nextPage, totalDocs ***REMOVED*** = data;

    const postIds = docs.map(post => post._id);

    const results = ***REMOVED***
      page,
      hasNextPage,
      nextPage,
      size,
      totalDocs,
      data: postIds
    ***REMOVED***


    res.status(200).send(results);
  ***REMOVED*** catch (error) ***REMOVED***
    next(error);
  ***REMOVED***
***REMOVED***;

/**
 * fetch likes for a specific post
 * @param ***REMOVED*******REMOVED*** req
 * @param ***REMOVED*******REMOVED*** res
 * @param ***REMOVED*******REMOVED*** next
 */
export const fetchLikes = async (req, res, next) => ***REMOVED***

  try ***REMOVED***
    let ***REMOVED*** page, size ***REMOVED*** = req.query;

    if (!page) ***REMOVED***
      page = 1;
    ***REMOVED***

    if (!size) ***REMOVED***
      size = 12;
    ***REMOVED***

    const limit = parseInt(size);
    let options = ***REMOVED***
      sort: ***REMOVED*** _id: -1 ***REMOVED***,
      lean: true,
      page: page,
      limit: limit,
    ***REMOVED***;

    const ***REMOVED*** id ***REMOVED*** = req.params;

    if (!id) ***REMOVED***
      throw httpError.BadRequest(`Request missing post id (:id) as a parameter`);
    ***REMOVED***

    const exist = await Post.findOne(***REMOVED*** _id: id ***REMOVED***);
    if (!exist) ***REMOVED***
      throw httpError.NotFound();
    ***REMOVED***

    const data = await Like.paginate(***REMOVED*** postId: id ***REMOVED***, options);
    const ***REMOVED*** docs, hasNextPage, nextPage, totalDocs ***REMOVED*** = data;
    const likes = docs.map(likedPost => (***REMOVED*** _id: likedPost._id, userId: likedPost.userId ***REMOVED***));

    const result = ***REMOVED***
      page,
      hasNextPage,
      nextPage,
      size,
      totalDocs,
      data: likes
    ***REMOVED***

    res.status(200).send(result);
  ***REMOVED*** catch (error) ***REMOVED***
    next(error);
  ***REMOVED***
***REMOVED***;

/**
 * check if auth user likes a specific post
 * @param ***REMOVED*******REMOVED*** req
 * @param ***REMOVED*******REMOVED*** res
 * @param ***REMOVED*******REMOVED*** next
 */
export const isLiked = async (req, res, next) => ***REMOVED***
  try ***REMOVED***
    const userId = req.authUser;
    const postId = req.params.id;

    if (!postId) ***REMOVED***
      throw httpError.BadRequest();
    ***REMOVED***

    const exist = await Post.findOne(***REMOVED*** _id: postId ***REMOVED***);
    if (!exist) ***REMOVED***
      throw httpError.NotFound(`Post $***REMOVED***postId***REMOVED*** not found`);
    ***REMOVED***

    const likedPosts = await Like.find(***REMOVED*** postId: postId, userId: userId ***REMOVED***);

    if (likedPosts && likedPosts.length > 0)
      res.status(200).send(true);
    else
      res.status(200).send(false);
  ***REMOVED*** catch (error) ***REMOVED***
    next(error);
  ***REMOVED***
***REMOVED***;

/**
 * check if auth user bookmarked a specific post
 * @param ***REMOVED*******REMOVED*** req
 * @param ***REMOVED*******REMOVED*** res
 * @param ***REMOVED*******REMOVED*** next
 */
export const isBookmarked = async (req, res, next) => ***REMOVED***
  try ***REMOVED***
    const userId = req.authUser;
    const postId = req.params.id;

    if (!postId) ***REMOVED***
      throw httpError.BadRequest();
    ***REMOVED***

    const exist = await Post.findOne(***REMOVED*** _id: postId ***REMOVED***);
    if (!exist) ***REMOVED***
      throw httpError.NotFound(`Post $***REMOVED***postId***REMOVED*** not found`);
    ***REMOVED***

    const bookmarkedPosts = await Bookmark.find(***REMOVED*** postId: postId, userId: userId ***REMOVED***);

    if (bookmarkedPosts && bookmarkedPosts.length > 0)
      res.status(200).send(true);
    else
      res.status(200).send(false);
  ***REMOVED*** catch (error) ***REMOVED***
    next(error);
  ***REMOVED***
***REMOVED***;

/** 
 * bookmark post
 * @param ***REMOVED*******REMOVED*** req 
 * @param ***REMOVED*******REMOVED*** res 
 * @param ***REMOVED*******REMOVED*** next 
 */
export const bookmarkPost = async (req, res, next) => ***REMOVED***
  const postId = req.params.id;
  const userId = req.authUser;
  if (!postId) ***REMOVED***
    throw httpError.BadRequest();
  ***REMOVED***
  try ***REMOVED***

    const exists = await Bookmark.findOne(***REMOVED*** postId: postId, userId: userId ***REMOVED***);
    if (exists) ***REMOVED***
      throw httpError.Conflict();
    ***REMOVED***
    const bookmarks = new Bookmark(***REMOVED*** postId: postId, userId: userId ***REMOVED***);
    const savedBookmark = await bookmarks.save();

    res.status(201).send(savedBookmark);
  ***REMOVED*** catch (error) ***REMOVED***
    next(error);
  ***REMOVED***
***REMOVED***;

/** 
 * un-bookmark post
 * @param ***REMOVED*******REMOVED*** req 
 * @param ***REMOVED*******REMOVED*** res 
 * @param ***REMOVED*******REMOVED*** next 
 */
export const unBookmarkPost = async (req, res, next) => ***REMOVED***
  const postId = req.params.id;
  const userId = req.authUser;
  if (!postId) ***REMOVED***
    throw httpError.BadRequest();
  ***REMOVED***
  try ***REMOVED***

    const bookmark = await Bookmark.findOne(***REMOVED*** postId: postId, userId: userId ***REMOVED***);
    if (!bookmark) ***REMOVED***
      throw httpError.NotFound();
    ***REMOVED***

    await bookmark.delete();

    res.status(200).send('Post bookmarked removed');
  ***REMOVED*** catch (error) ***REMOVED***
    next(error);
  ***REMOVED***
***REMOVED***;

/**
 * fetch posts bookmarked by user
 * @param ***REMOVED*******REMOVED*** req
 * @param ***REMOVED*******REMOVED*** res
 * @param ***REMOVED*******REMOVED*** next
 */
export const fetchBookmarkedPosts = async (req, res, next) => ***REMOVED***

  try ***REMOVED***
    let ***REMOVED*** page, size ***REMOVED*** = req.query;

    if (!page) ***REMOVED***
      page = 1;
    ***REMOVED***

    if (!size) ***REMOVED***
      size = 12;
    ***REMOVED***

    const limit = parseInt(size);
    let options = ***REMOVED***
      sort: ***REMOVED*** _id: -1 ***REMOVED***,
      lean: true,
      page: page,
      limit: limit,
    ***REMOVED***;

    const userId = req.authUser;
    if (!userId) ***REMOVED***
      throw httpError.BadRequest();
    ***REMOVED***

    const data = await Bookmark.paginate(***REMOVED*** userId: userId ***REMOVED***, options);
    const ***REMOVED*** docs, hasNextPage, nextPage, totalDocs ***REMOVED*** = data;

    const postIds = docs.map(bookmarkedPost => bookmarkedPost.postId);

    const results = ***REMOVED***
      page,
      hasNextPage,
      nextPage,
      size,
      totalDocs,
      data: postIds
    ***REMOVED***

    res.status(200).send(results);
  ***REMOVED*** catch (error) ***REMOVED***
    next(error);
  ***REMOVED***
***REMOVED***;
