import httpError from 'http-errors';
import mongoose from 'mongoose';

import Profile from '../models/profiles.js';
import User from '../models/users.js';


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
    httpError.BadRequest('Empty search params');
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
  const { bio, name, profilePicture, username } = req.body;

  try {
    if (!bio && !name && !profilePicture && !username) {
      throw httpError.BadRequest('nothing to update');
    }

    await Profile.findOneAndUpdate(
      { userId: userId },
      {
        $set: {
          bio: bio,
          name: name,
          profilePicture: profilePicture,
          username: username,
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


