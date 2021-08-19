import httpError from "http-errors";
import mongoose from "mongoose";

import Post from "../models/posts.js";
import User from "../models/users.js";
import Like from "../models/likes.js";
import Comment from "../models/comments.js";
/**
 * fetch post by id, with comments and likes
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const fetchPost = async (req, res, next) => {
  const postId = req.params.id;
  if (!postId) {
    httpError.BadRequest();
  }
  try {
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      httpError.NotFound();
    }

    const comments = await getCommentsForPostHelperFn(postId, next);
    const likes = await fetchLikesHelperFn(postId, next);

    const postObj = {
      post: post,
      comments: comments,
      likes: likes
    }

    res.status(200).send(postObj);
  } catch (error) {
    next(error);
  }
};

/**
 * fetch all posts by user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const fetchUserPosts = async (req, res, next) => {
  const userId = req.params.id;
  if (!userId) {
    throw httpError.BadRequest();
  }

  try {
    const doesExist = await User.findOne({ userId: userId });

    if (!doesExist) {
      throw httpError.NotFound();
    }

    const posts = await Post.find({ userId: userId });

    res.status(200).send(posts);
  } catch (error) {
    next(error);
  }
};

/**
 * fetch comments by postId
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const fetchPostComments = async (req, res, next) => {
  const postId = req.params.id;
  if (!postId) {
    httpError.BadRequest();
  }
  try {
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      httpError.NotFound();
    }

    const comments = await getCommentsForPostHelperFn(postId, next);

    res.status(200).send(comments);
  } catch (error) {
    next(error);
  }
}

/**
 * create new comment
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const createComment = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.authUser;
  const { comment } = req.body;

  if (!postId || !comment) {
    throw httpError.BadRequest();
  }

  try {
    const doesExist = await Post.find({ _id: postId });
    if (!doesExist) {
      throw httpError.NotFound();
    }

    //comment obj
    const commentObj = new Comment({
      postId: postId,
      userId: userId,
      comment: comment,
    });

    await commentObj.save();
    res.status(201).send("Comment created");
  } catch (error) {
    next(error);
  }
};

/**
 * creates a new post
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const createPost = async (req, res, next) => {
  const userId = req.authUser;

  const { content, imageUri } = req.body;

  try {
    const post = new Post({
      userId: userId,
      content: content,
      imageUri: imageUri,
    });

    const savedPost = await post.save();

    if (!savedPost) {
      throw httpError.InternalServerError();
    }
    res.status(201).send();
  } catch (error) {
    next(error);
  }
};

/**
 * update post
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const updatePost = async (req, res, next) => {
  const postId = req.params.id;
  const { content, imageUri } = req.body;

  try {
    if (!postId && !content && !imageUri) {
      throw httpError.BadRequest('postId not provided');
    }

    if (!postId && !content && !imageUri) {
      throw httpError.BadRequest('nothing to update');
    }

    await Post.findOneAndUpdate(
      { _id: postId },
      {
        $set: {
          content: content,
          imageUri: imageUri,
          updatedAt: new Date()
        }
      }
      , {
        upsert: true
      }
    );

    res.status(200).send('Post updated successfully');
  } catch (error) {
    next(error)
  }
}

/** 
 * like post
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const likePost = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.authUser;
  if (!postId) {
    throw httpError.BadRequest();
  }
  try {

    const exists = await Like.findOne({ postId: postId, userId: userId });
    if (exists) {
      throw httpError.Conflict();
    }
    const likes = new Like({ postId: postId, userId: userId });
    await likes.save();

    res.status(201).send('Post liked');
  } catch (error) {
    next(error);
  }
};

/** 
 * unlike post
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const unLikePost = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.authUser;
  if (!postId) {
    throw httpError.BadRequest();
  }
  try {

    const like = await Like.findOne({ postId: postId, userId: userId });
    if (!like) {
      throw httpError.NotFound();
    }

    await like.delete();

    res.status(201).send('Post unliked');
  } catch (error) {
    next(error);
  }
};

/**
 * fetch posts liked by user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const fetchLikedPosts = async (req, res, next) => {
  const userId = req.params.id;

  try {
    if (!userId) {
      throw httpError.BadRequest();
    }
    const likedPosts = await Like.find({ userId: userId });
    const postIds = likedPosts.map(likedPost => likedPost.postId);
    const likes = await Post.find({ _id: { $in: postIds } });

    res.status(200).send(likes);
  } catch (error) {
    next(error);
  }
};

/**
 * fetch post likes
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const fetchLikes = async (req, res, next) => {
  const postId = req.params.id;
  if (!postId) {
    throw httpError.BadRequest();
  }

  try {
    const exist = await Post.findOne({ _id: postId });
    if (!exist) {
      throw httpError.NotFound();
    }

    const likes = await fetchLikesHelperFn(postId, next);

    res.status(200).send(likes);
  } catch (error) {
    next(error);
  }
};

/**
 *helper function to get comments for post 
 * @param {*} postId 
 * @param {*} next
 */
const getCommentsForPostHelperFn = async (postId, next) => {
  try {
    const postComments = await Comment.find({ postId: postId });
    return postComments;
  } catch (error) {
    next(error);
  }
};

/**
 * helper function to retreive likes for post
 * @param {*} postId
 * @param {*} next
 */
const fetchLikesHelperFn = async (postId, next) => {
  try {

    const likes = await Like.find({ postId: postId });
    const result = likes.map(likedPost => ({ _id: likedPost._id, userId: likedPost.userId }));

    return result;
  } catch (error) {
    next(error);
  }
};