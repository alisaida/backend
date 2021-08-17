import httpError from 'http-errors';
import mongoose from 'mongoose';

import Profile from '../models/profiles.js';
import User from '../models/users.js';

/**
 * create profile
 * @param req
 * @param res
 * @param next
 */
export const createProfile = async (req, res, next) => ***REMOVED***
  const userId = req.authUser;
  const ***REMOVED*** bio, name, profilePicture, username ***REMOVED*** = req.body;

  try ***REMOVED***
    if (!username) ***REMOVED***
      throw httpError.BadRequest('username field is empty');
    ***REMOVED***

    if (!name) ***REMOVED***
      throw httpError.BadRequst('name field is empty');
    ***REMOVED***


    const doesExist = await Profile.findOne(***REMOVED*** userId ***REMOVED***);

    if (doesExist) ***REMOVED***
      throw httpError.Conflict('profile already exists, try updating');
    ***REMOVED***

    const profile = new Profile(***REMOVED***
      userId: userId,
      username: username,
      name: name,
      profilePicture: profilePicture || "",
      bio: bio || ""
    ***REMOVED***);

    await profile.save();

    res.status(201).send('Profile created');
  ***REMOVED*** catch (error) ***REMOVED***
    next(error)
  ***REMOVED***
***REMOVED***

/*
 * fetch profile by userId
 * @param req
 * @param res
 * @param next
 */
export const fetchProfileByUserId = async (req, res, next) => ***REMOVED***
  const userId = req.params.id;

  try ***REMOVED***

    const profile = await Profile.findOne(***REMOVED*** userId: userId ***REMOVED***);

    if (!profile) ***REMOVED***
      throw httpError.NotFound();
    ***REMOVED***

    res.status(200).send(***REMOVED*** profile ***REMOVED***);
  ***REMOVED*** catch (error) ***REMOVED***
    next(error);
  ***REMOVED***
***REMOVED***

/*
 * fetch profile by username/name 
 * @param req
 * @param res
 * @param next
 */
export const fetchProfileByQueryParams = async (req, res, next) => ***REMOVED***

  const ***REMOVED*** name, username ***REMOVED*** = req.query;
  if (!name && !username) ***REMOVED***
    httpError.BadRequest('Empty search params');
  ***REMOVED***

  try ***REMOVED***
    let profiles;
    let caseInsensitive; //search with specific case
    if (username) ***REMOVED***
      caseInsensitive = new RegExp(["^", username, "$"].join(""), "i");
      profiles = await Profile.find(***REMOVED*** username: caseInsensitive ***REMOVED***);
    ***REMOVED***
    else ***REMOVED***
      caseInsensitive = new RegExp(["^", name, "$"].join(""), "i");
      profiles = await Profile.find(***REMOVED*** name: caseInsensitive ***REMOVED***);
    ***REMOVED***
    res.status(200).send(***REMOVED*** profiles ***REMOVED***);
  ***REMOVED*** catch (error) ***REMOVED***
    next(error);
  ***REMOVED***
***REMOVED***

/**
 * update profile
 * @param req
 * @param res
 * @param next
 */
export const updateProfile = async (req, res, next) => ***REMOVED***
  const userId = req.authUser;
  const ***REMOVED*** bio, name, profilePicture, username ***REMOVED*** = req.body;

  try ***REMOVED***
    if (!bio && !name && !profilePicture && !username) ***REMOVED***
      throw httpError.BadRequest('nothing to update');
    ***REMOVED***

    await Profile.findOneAndUpdate(
      ***REMOVED*** userId: userId ***REMOVED***,
      ***REMOVED***
        $set: ***REMOVED***
          bio: bio,
          name: name,
          profilePicture: profilePicture,
          username: username,
          updatedAt: new Date()
        ***REMOVED***
      ***REMOVED***
      , ***REMOVED***
        upsert: true
      ***REMOVED***
    );

    res.status(200).send('Profile updated successfully');
  ***REMOVED*** catch (error) ***REMOVED***
    next(error)
  ***REMOVED***
***REMOVED***


