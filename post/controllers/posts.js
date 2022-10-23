import httpError from "http-errors";
import mongoose from "mongoose";

import Post from "../models/posts.js";
import User from "../models/users.js";
import Like from "../models/likes.js";
import Bookmark from "../models/bookmarks.js";
import Comment from "../models/comments.js";
import Tag from "../models/tags.js";
import Location from '../models/locations.js';
import Person from "../models/person.js";

/**
 * home
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const home = async (req, res, next) => {
  res.send('Welcome!');
}

/**
 * fetch all posts
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const fetchFeed = async (req, res, next) => {
  try {
    let { page, size } = req.query;

    if (!page) {
      page = 1;
    }

    if (!size) {
      size = 12;
    }

    const limit = parseInt(size);

    let options = {
      sort: { createdAt: -1 },
      lean: true,
      page: page,
      limit: limit,
    };

    const data = await Post.paginate({}, options);
    const { docs, hasNextPage, nextPage, totalDocs } = data;

    const postIds = docs.map(post => post._id);

    const results = {
      page,
      hasNextPage,
      nextPage,
      size,
      totalDocs,
      data: postIds
    }

    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
};

/**
 * fetch post by id, with comments and likes
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const fetchPost = async (req, res, next) => {
  const postId = req.params.id;
  if (!postId) {
    throw httpError.BadRequest();
  }
  try {
    let post = await Post.findOne({ _id: postId });
    if (!post) {
      throw httpError.NotFound();
    }

    const comments = await Comment.countDocuments({ postId: postId }).exec();
    const likes = await Like.countDocuments({ postId: postId }).exec();

    const data = {
      _id: post._id,
      createdAt: post.createdAt,
      userId: post.userId,
      caption: post.caption,
      imageUri: post.imageUri,
      location: post.location,
      tags: post.tags,
      likes,
      comments
    }
    res.status(200).send({ data });
  } catch (error) {
    next(error);
  }
};

/**
 * delete post by id
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const deletePost = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.authUser;
  if (!postId) {
    throw httpError.BadRequest();
  }
  try {
    let post = await Post.findOne({ _id: postId });
    if (!post) {
      throw httpError.NotFound();
    }

    if (post.userId !== userId) {
      throw httpError.Unauthorized();
    }

    //asynchronously delete post all related comments, likes and people who bookmark
    await Post.deleteOne({ _id: postId });
    await Like.deleteMany({ postId: postId });
    await Comment.deleteMany({ postId: postId });
    await Bookmark.deleteMany({ postId: postId });

    res.status(200).send({ message: 'Post delete successfully' });
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

  try {
    let { page, size } = req.query;

    if (!page) {
      page = 1;
    }

    if (!size) {
      size = 12;
    }

    const limit = parseInt(size);

    let options = {
      sort: { createdAt: -1 },
      lean: true,
      page: page,
      limit: limit,
    };

    const userId = req.params.id;
    if (!userId) {
      throw httpError.BadRequest('Payload is missing userId');
    }

    const doesExist = await User.findOne({ userId: userId });

    if (!doesExist) {
      throw httpError.NotFound();
    }

    const data = await Post.paginate({ userId: userId }, options);
    const { docs, hasNextPage, nextPage, totalDocs } = data;

    const posts = docs.map((post) => post._id);

    const results = {
      page,
      hasNextPage,
      nextPage,
      size,
      totalDocs,
      data: posts
    }

    res.status(200).send(results);
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
  try {
    let { page, size } = req.query;
    if (!page) {
      page = 1;
    }

    if (!size) {
      size = 10;
    }

    const limit = parseInt(size);

    let options = {
      sort: { createdAt: -1 },
      lean: true,
      page: page,
      limit: limit,
    };

    let { id } = req.params;

    if (!id) {
      throw httpError.BadRequest();
    }
    const post = await Post.findOne({ _id: id });

    if (!post) {
      throw httpError.NotFound();
    }

    const data = await Comment.paginate({ postId: id }, options);

    const { docs, hasNextPage, nextPage, totalDocs } = data;

    const results = {
      page,
      hasNextPage,
      nextPage,
      size,
      totalDocs,
      data: docs
    }

    res.status(200).send(results);
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
      createdAt: new Date().toISOString()
    });

    const savedComment = await commentObj.save();

    if (!savedComment) {
      throw httpError.InternalServerError();
    }

    res.status(201).send(savedComment);
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

  const { caption, imageUri, location, people } = req.body;

  try {

    if (!imageUri || imageUri === '') {
      throw httpError.BadRequest('Image uri missing from the payload');
    }

    //hash tags
    const hashtags = !!caption ? caption.match(/(?:^|\W)#(\w+)(?!\w)/g) : [];
    const tagIds = [];
    if (hashtags) {
      for (let i = 0; i < hashtags.length; i++) {
        const tag = hashtags[i].trim();
        if (!!tag && tag.length > 1) {
          let savedTag = await saveTag(tag.substring(1));
          tagIds.push(savedTag._id);
        }
      }
    }

    //location
    let locationId = null;
    if (location) {
      const savedLocation = await saveLocation(location);
      locationId = savedLocation._id;
    }

    const post = new Post({
      userId: userId,
      caption: caption,
      imageUri: imageUri,
      location: locationId,
      createdAt: new Date().toISOString(),
      people: people,
      tags: tagIds
    });

    const savedPost = await post.save();

    if (!savedPost) {
      throw httpError.InternalServerError();
    }
    res.status(201).send(savedPost);
  } catch (error) {
    next(error);
  }
};

const saveLocation = async (location) => {
  try {
    const exists = await Location.findOne({ location: location });
    if (exists) {
      return exists;
    }

    const locationObj = new Location({
      location: location
    });
    const savedLocation = await locationObj.save();

    if (!savedLocation) {
      throw httpError.InternalServerError();
    }

    return savedLocation;
  } catch (error) {
    throw httpError.InternalServerError();
  }
}

const saveTag = async (tag) => {
  try {
    const exists = await Tag.findOne({ tag: tag });
    if (exists) {
      return exists;
    }

    const tagObj = new Tag({
      tag: tag
    });
    const savedTag = await tagObj.save();

    if (!savedTag) {
      throw httpError.InternalServerError();
    }

    return savedTag;
  } catch (error) {
    throw httpError.InternalServerError();
  }
}

/**
 * fetch posts by tag
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

export const getPostsByTagId = async (req, res, next) => {

  const tagId = req.params.id;
  if (!tagId) {
    throw httpError.BadRequest();
  }

  try {
    let { page, size } = req.query;

    if (!page) {
      page = 1;
    }

    if (!size) {
      size = 10;
    }

    const limit = parseInt(size);

    let options = {
      sort: { createdAt: -1 },
      lean: true,
      page: page,
      limit: limit,
    };

    const tagObj = await Tag.findOne({ _id: tagId });

    if (!tagObj) {
      throw httpError.NotFound();
    }

    const data = await Post.paginate({ tags: tagObj._id }, options);
    const { docs, hasNextPage, nextPage, totalDocs } = data;

    const posts = docs.map((post) => post._id);

    const results = {
      page,
      hasNextPage,
      nextPage,
      size,
      totalDocs,
      data: posts
    }

    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
}

export const getTagByName = async (req, res, next) => {
  try {
    let { page, size, name } = req.query;
    if (!page) {
      page = 1;
    }

    if (!size) {
      size = 10;
    }

    const limit = parseInt(size);

    let options = {
      sort: { createdAt: -1 },
      lean: true,
      page: page,
      limit: limit,
    };

    if (!name) {
      throw httpError.BadRequest();
    }
    const tag = await Tag.findOne({ tag: name });

    res.status(200).send(tag);
  } catch (error) {
    next(error);
  }
}

/**
 * get location by id
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const fetchLocationById = async (req, res, next) => {
  const locationId = req.params.id;
  if (!locationId) {
    throw httpError.BadRequest();
  }
  try {
    const location = await Location.findOne({ _id: locationId });
    if (!location) {
      throw httpError.NotFound();
    }

    res.status(200).send(location);
  } catch (error) {
    next(error);
  }
};

/**
 * getTagsByNameLike
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const getTagsByNameLike = async (req, res, next) => {

  try {
    let { name, page, size } = req.query;
    if (!page) {
      page = 1;
    }

    if (!size) {
      size = 10;
    }

    const limit = parseInt(size);

    let options = {
      sort: { createdAt: -1 },
      lean: true,
      page: page,
      limit: limit,
    };


    if (!name) {
      throw httpError.BadRequest('Empty search params');
    }

    const data = await Tag.paginate({ tag: { $regex: name, $options: 'i' } }, options);
    const { docs, hasNextPage, nextPage, totalDocs } = data;

    const results = {
      page,
      hasNextPage,
      nextPage,
      size,
      totalDocs,
      data: docs
    }

    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
}

/**
 * getLocationsByNameLike
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const getLocationsByNameLike = async (req, res, next) => {

  try {
    let { name, page, size } = req.query;
    if (!page) {
      page = 1;
    }

    if (!size) {
      size = 10;
    }

    const limit = parseInt(size);

    let options = {
      sort: { createdAt: -1 },
      lean: true,
      page: page,
      limit: limit,
    };


    if (!name) {
      throw httpError.BadRequest('Empty search params');
    }

    const data = await Location.paginate({ location: { $regex: name, $options: 'i' } }, options);
    const { docs, hasNextPage, nextPage, totalDocs } = data;

    const results = {
      page,
      hasNextPage,
      nextPage,
      size,
      totalDocs,
      data: docs
    }

    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
}

/**
 * fetch posts by tag
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

export const getPostsByLocationId = async (req, res, next) => {

  const locationId = req.params.id;
  if (!locationId) {
    throw httpError.BadRequest();
  }

  try {
    let { page, size } = req.query;

    if (!page) {
      page = 1;
    }

    if (!size) {
      size = 10;
    }

    const limit = parseInt(size);

    let options = {
      sort: { createdAt: -1 },
      lean: true,
      page: page,
      limit: limit,
    };

    const locationObj = await Location.findOne({ _id: locationId });

    if (!locationObj) {
      throw httpError.NotFound();
    }

    const data = await Post.paginate({ location: locationObj._id }, options);
    const { docs, hasNextPage, nextPage, totalDocs } = data;

    const posts = docs.map((post) => post._id);

    const results = {
      page,
      hasNextPage,
      nextPage,
      size,
      totalDocs,
      data: posts
    }

    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
}

/**
 * update post
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const updatePost = async (req, res, next) => {
  const postId = req.params.id;
  const { caption, imageUri } = req.body;

  try {
    if (!postId) {
      throw httpError.BadRequest();
    }
    else if (!caption && !imageUri) {
      throw httpError.BadRequest('nothing to update');
    }

    await Post.findOneAndUpdate(
      { _id: postId },
      {
        $set: {
          caption: caption,
          imageUri: imageUri,
          updatedAt: new Date().toISOString()
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

    res.status(200).send('Post unliked');
  } catch (error) {
    next(error);
  }
};

/**
 * fetch posts liked by authUser
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const fetchLikedPosts = async (req, res, next) => {

  try {
    let { page, size } = req.query;

    if (!page) {
      page = 1;
    }

    if (!size) {
      size = 12;
    }

    const limit = parseInt(size);
    let options = {
      sort: { _id: -1 },
      lean: true,
      page: page,
      limit: limit,
    };

    const userId = req.authUser;

    const data = await Like.paginate({ userId: userId }, options);
    const { docs, hasNextPage, nextPage, totalDocs } = data;

    const postIds = docs.map(post => post._id);

    const results = {
      page,
      hasNextPage,
      nextPage,
      size,
      totalDocs,
      data: postIds
    }


    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
};

/**
 * fetch likes for a specific post
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const fetchLikes = async (req, res, next) => {

  try {
    let { page, size } = req.query;

    if (!page) {
      page = 1;
    }

    if (!size) {
      size = 12;
    }

    const limit = parseInt(size);
    let options = {
      sort: { _id: -1 },
      lean: true,
      page: page,
      limit: limit,
    };

    const { id } = req.params;

    if (!id) {
      throw httpError.BadRequest(`Request missing post id (:id) as a parameter`);
    }

    const exist = await Post.findOne({ _id: id });
    if (!exist) {
      throw httpError.NotFound();
    }

    const data = await Like.paginate({ postId: id }, options);
    const { docs, hasNextPage, nextPage, totalDocs } = data;
    const likes = docs.map(likedPost => ({ _id: likedPost._id, userId: likedPost.userId }));

    const result = {
      page,
      hasNextPage,
      nextPage,
      size,
      totalDocs,
      data: likes
    }

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

/**
 * check if auth user likes a specific post
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const isLiked = async (req, res, next) => {
  try {
    const userId = req.authUser;
    const postId = req.params.id;

    if (!postId) {
      throw httpError.BadRequest();
    }

    const exist = await Post.findOne({ _id: postId });
    if (!exist) {
      throw httpError.NotFound(`Post ${postId} not found`);
    }

    const likedPosts = await Like.find({ postId: postId, userId: userId });

    if (likedPosts && likedPosts.length > 0)
      res.status(200).send(true);
    else
      res.status(200).send(false);
  } catch (error) {
    next(error);
  }
};

/**
 * check if auth user bookmarked a specific post
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const isBookmarked = async (req, res, next) => {
  try {
    const userId = req.authUser;
    const postId = req.params.id;

    if (!postId) {
      throw httpError.BadRequest();
    }

    const exist = await Post.findOne({ _id: postId });
    if (!exist) {
      throw httpError.NotFound(`Post ${postId} not found`);
    }

    const bookmarkedPosts = await Bookmark.find({ postId: postId, userId: userId });

    if (bookmarkedPosts && bookmarkedPosts.length > 0)
      res.status(200).send(true);
    else
      res.status(200).send(false);
  } catch (error) {
    next(error);
  }
};

/** 
 * bookmark post
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const bookmarkPost = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.authUser;
  if (!postId) {
    throw httpError.BadRequest();
  }
  try {

    const exists = await Bookmark.findOne({ postId: postId, userId: userId });
    if (exists) {
      throw httpError.Conflict();
    }
    const bookmarks = new Bookmark({ postId: postId, userId: userId });
    const savedBookmark = await bookmarks.save();

    res.status(201).send(savedBookmark);
  } catch (error) {
    next(error);
  }
};

/** 
 * un-bookmark post
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const unBookmarkPost = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.authUser;
  if (!postId) {
    throw httpError.BadRequest();
  }
  try {

    const bookmark = await Bookmark.findOne({ postId: postId, userId: userId });
    if (!bookmark) {
      throw httpError.NotFound();
    }

    await bookmark.delete();

    res.status(200).send('Post bookmarked removed');
  } catch (error) {
    next(error);
  }
};

/**
 * fetch posts bookmarked by user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const fetchBookmarkedPosts = async (req, res, next) => {

  try {
    let { page, size } = req.query;

    if (!page) {
      page = 1;
    }

    if (!size) {
      size = 12;
    }

    const limit = parseInt(size);
    let options = {
      sort: { _id: -1 },
      lean: true,
      page: page,
      limit: limit,
    };

    const userId = req.authUser;
    if (!userId) {
      throw httpError.BadRequest();
    }

    const data = await Bookmark.paginate({ userId: userId }, options);
    const { docs, hasNextPage, nextPage, totalDocs } = data;

    const postIds = docs.map(bookmarkedPost => bookmarkedPost.postId);

    const results = {
      page,
      hasNextPage,
      nextPage,
      size,
      totalDocs,
      data: postIds
    }

    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
};
