import httpError from 'http-errors';
import mongoose from 'mongoose';

import Profile from '../models/profiles.js';
import User from '../models/users.js';
import Follow from '../models/follow.js';
import { publishToQueue } from '../utils/rabbitmq.js'

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
 * logs in user and generates a pair of access and refresh tokens
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const me = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.authUser });

    res.status(200).send({ profile });
  } catch (err) {
    next(err);
  }
}

/**
 * create profile
 * @param req
 * @param res
 * @param next
 */
export const createProfile = async (req, res, next) => {
  const userId = req.authUser;
  const { bio, name, profilePicture, username } = req.body;

  try {
    if (!username) {
      throw httpError.BadRequest('username field is empty');
    }

    if (!name) {
      throw httpError.BadRequst('name field is empty');
    }


    const doesExist = await Profile.findOne({ userId });

    if (doesExist) {
      throw httpError.Conflict('profile already exists, try updating');
    }

    const profile = new Profile({
      userId: userId,
      username: username,
      name: name,
      profilePicture: profilePicture || "",
      bio: bio || ""
    });

    await profile.save();

    res.status(201).send('Profile created');
  } catch (error) {
    next(error)
  }
}

/*
 * fetch profile by userId
 * @param req
 * @param res
 * @param next
 */
export const fetchProfileByUserId = async (req, res, next) => {
  const userId = req.params.id;

  try {

    const profile = await Profile.findOne({ userId: userId });

    if (!profile) {
      throw httpError.NotFound();
    }

    res.status(200).send({ profile });
  } catch (error) {
    next(error);
  }
}

/*
 * fetch profile by username/name 
 * @param req
 * @param res
 * @param next
 */
export const fetchProfileByQueryParams = async (req, res, next) => {

  const { name, username } = req.query;
  if (!name && !username) {
    throw httpError.BadRequest('Empty search params');
  }

  try {
    let profiles;
    let caseInsensitive; //search with specific case
    if (username) {
      caseInsensitive = new RegExp(["^", username, "$"].join(""), "i");
      profiles = await Profile.find({ username: caseInsensitive });
    }
    else {
      caseInsensitive = new RegExp(["^", name, "$"].join(""), "i");
      profiles = await Profile.find({ name: caseInsensitive });
    }
    res.status(200).send({ profiles });
  } catch (error) {
    next(error);
  }
}

/**
 * update profile picture
 * @param req
 * @param res
 * @param next
 */
export const updateProfilePicture = async (req, res, next) => {
  const userId = req.authUser;
  const { imageUri } = req.body;

  try {
    if (!imageUri) {
      throw httpError.BadRequest('missing profile picture image uri from the request body: imageUri');
    }

    await Profile.findOneAndUpdate(
      { userId: userId },
      {
        $set: {
          profilePicture: imageUri,
          updatedAt: new Date().toISOString()
        }
      }
      , {
        upsert: true
      }
    );

    res.status(200).send('Profile updated successfully');
  } catch (error) {
    next(error)
  }
}

/**
 * update profile bio
 * @param req
 * @param res
 * @param next
 */
export const updateProfileBio = async (req, res, next) => {
  const userId = req.authUser;
  const { bio } = req.body;

  try {
    if (!bio) {
      throw httpError.BadRequest('missing bio from the request body');
    }

    await Profile.findOneAndUpdate(
      { userId: userId },
      {
        $set: {
          bio: bio,
          updatedAt: new Date().toISOString()
        }
      }
      , {
        upsert: true
      }
    );

    res.status(200).send('Profile updated successfully');
  } catch (error) {
    next(error)
  }
}

/**
 * update profile
 * @param req
 * @param res
 * @param next
 */
export const updateProfile = async (req, res, next) => {
  const userId = req.authUser;
  const { bio, name, profilePicture, username, isPublic } = req.body;

  try {
    if (!name && !username) {
      throw httpError.BadRequest('Payload missing name or username');
    }

    await Profile.findOneAndUpdate(
      { userId: userId },
      {
        $set: {
          bio: bio,
          name: name,
          profilePicture: profilePicture,
          username: username,
          isPublic: isPublic,
          updatedAt: new Date().toISOString()
        }
      }
      , {
        upsert: true
      }
    );

    //payload for other microservices
    let data = {
      userId: userId,
      name: name,
      profilePicture: profilePicture,
      username: username,
      isPublic: isPublic,
      bio: bio
    }

    console.log('publish events to rabbitmq UPDATE_USER_AUTH, UPDATE_USER_CHAT and UPDATE_USER_POST')

    publishToQueue('UPDATE_USER_AUTH', data);
    publishToQueue('UPDATE_USER_CHAT', data);
    publishToQueue('UPDATE_USER_POST', data);

    res.status(200).send('Profile updated successfully');
  } catch (error) {
    next(error)
  }
}

/**
 * fetch following between two profiles
 * @param req
 * @param res
 * @param next
 */
export const fetchFollow = async (req, res, next) => {

  try {
    const follower = req.params.id1;
    const following = req.params.id2;

    const follow = await Follow.findOne({ follower: follower, following: following });
    if (!follow) {
      throw httpError.NotFound();
    }

    res.status(200).send({ follow });
  } catch (error) {
    next(error);
  }
}

/**
 * create following between two profiles
 * @param req
 * @param res
 * @param next
 */
export const createFollow = async (req, res, next) => {

  try {
    const follower = req.authUser;
    const following = req.params.id;

    const profile = await Profile.findOne({ userId: following });

    if (!profile) {
      throw httpError.NotFound(`Profile you're trying to follow does not exist`);
    }

    const { isPublic } = profile;

    const status = isPublic ? 'accepted' : 'pending';

    const follow = new Follow({
      follower: follower,
      following: following,
      status: status,
      createdAt: new Date().toISOString()
    });

    const followingSaved = await follow.save();

    res.status(201).send(followingSaved);
  } catch (error) {
    next(error)
  }
}

/** 
 * unfollow profile
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const unFollow = async (req, res, next) => {
  try {
    const follower = req.authUser;
    const following = req.params.id;
    const { relation } = req.body;

    if (!relation) {
      throw httpError.BadRequest('Payload missing relation');
    }

    let follow;
    if (relation === 'follower') {
      follow = await Follow.findOne({ follower: follower, following: following });
    } else if (relation === 'following') {
      follow = await Follow.findOne({ following: follower, follower: following });
    }

    if (!follow) {
      throw httpError.NotFound();
    }

    await follow.delete();

    res.status(202).send('Profile unfollowed');
  } catch (error) {
    next(error);
  }
};

/**
 * fetch followings by userId
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const fetchFollowings = async (req, res, next) => {
  try {
    const { status } = req.body;
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
    const profile = await Profile.findOne({ userId: id });

    if (!profile) {
      throw httpError.NotFound();
    }

    let data;
    if (status)
      data = await Follow.paginate({ follower: id, status: status }, options);
    else
      data = await Follow.paginate({ follower: id }, options);

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
 * fetch followings by userId
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const fetchFollowers = async (req, res, next) => {
  try {
    const { status } = req.body;
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
    const profile = await Profile.findOne({ userId: id });

    if (!profile) {
      throw httpError.NotFound();
    }

    let data;
    if (status)
      data = await Follow.paginate({ following: id, status: status }, options);
    else
      data = await Follow.paginate({ following: id }, options);

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
 * accept pending following
 * @param req
 * @param res
 * @param next
 */
export const acceptFollowing = async (req, res, next) => {
  try {
    const userId = req.authUser;

    let { id } = req.params;

    if (!id) {
      throw httpError.BadRequest();
    }

    await Follow.findOneAndUpdate(
      { following: userId, _id: id },
      {
        $set: {
          status: 'accepted'
        }
      }
      , {
        upsert: true
      }
    );

    res.status(201).send('Following accepted');
  } catch (error) {
    next(error)
  }
}

/**
 * reject pending following
 * @param req
 * @param res
 * @param next
 */
export const rejectFollowing = async (req, res, next) => {
  try {
    const userId = req.authUser;
    let { id } = req.params;

    const follow = await Follow.findOne({ following: userId, _id: id });
    if (!follow) {
      throw httpError.NotFound();
    }

    await follow.delete();

    res.status(202).send('Follow request deleted');
  } catch (error) {
    next(error);
  }
}