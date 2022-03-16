import httpError from 'http-errors';
import mongoose from 'mongoose';

import Profile from '../models/profiles.js';
import User from '../models/users.js';
import Follow from '../models/follow.js';
import ***REMOVED*** publishToQueue ***REMOVED*** from '../utils/rabbitmq.js'

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
 * logs in user and generates a pair of access and refresh tokens
 * @param ***REMOVED*******REMOVED*** req 
 * @param ***REMOVED*******REMOVED*** res 
 * @param ***REMOVED*******REMOVED*** next 
 */
export const me = async (req, res, next) => ***REMOVED***
  try ***REMOVED***
    const profile = await Profile.findOne(***REMOVED*** userId: req.authUser ***REMOVED***);

    res.status(200).send(***REMOVED*** profile ***REMOVED***);
  ***REMOVED*** catch (err) ***REMOVED***
    next(err);
  ***REMOVED***
***REMOVED***

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
    throw httpError.BadRequest('Empty search params');
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
 * update profile picture
 * @param req
 * @param res
 * @param next
 */
export const updateProfilePicture = async (req, res, next) => ***REMOVED***
  const userId = req.authUser;
  const ***REMOVED*** imageUri ***REMOVED*** = req.body;

  try ***REMOVED***
    if (!imageUri) ***REMOVED***
      throw httpError.BadRequest('missing profile picture image uri from the request body: imageUri');
    ***REMOVED***

    await Profile.findOneAndUpdate(
      ***REMOVED*** userId: userId ***REMOVED***,
      ***REMOVED***
        $set: ***REMOVED***
          profilePicture: imageUri,
          updatedAt: new Date().toISOString()
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

/**
 * update profile bio
 * @param req
 * @param res
 * @param next
 */
export const updateProfileBio = async (req, res, next) => ***REMOVED***
  const userId = req.authUser;
  const ***REMOVED*** bio ***REMOVED*** = req.body;

  try ***REMOVED***
    if (!bio) ***REMOVED***
      throw httpError.BadRequest('missing bio from the request body');
    ***REMOVED***

    await Profile.findOneAndUpdate(
      ***REMOVED*** userId: userId ***REMOVED***,
      ***REMOVED***
        $set: ***REMOVED***
          bio: bio,
          updatedAt: new Date().toISOString()
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

/**
 * update profile
 * @param req
 * @param res
 * @param next
 */
export const updateProfile = async (req, res, next) => ***REMOVED***
  const userId = req.authUser;
  const ***REMOVED*** bio, name, profilePicture, username, isPublic ***REMOVED*** = req.body;

  try ***REMOVED***
    if (!name && !username) ***REMOVED***
      throw httpError.BadRequest('Payload missing name or username');
    ***REMOVED***

    await Profile.findOneAndUpdate(
      ***REMOVED*** userId: userId ***REMOVED***,
      ***REMOVED***
        $set: ***REMOVED***
          bio: bio,
          name: name,
          profilePicture: profilePicture,
          username: username,
          isPublic: isPublic,
          updatedAt: new Date().toISOString()
        ***REMOVED***
      ***REMOVED***
      , ***REMOVED***
        upsert: true
      ***REMOVED***
    );

    //payload for other microservices
    let data = ***REMOVED***
      userId: userId,
      name: name,
      profilePicture: profilePicture,
      username: username,
      isPublic: isPublic,
      bio: bio
    ***REMOVED***

    console.log('publish events to rabbitmq UPDATE_USER_AUTH, UPDATE_USER_CHAT and UPDATE_USER_POST')

    publishToQueue('UPDATE_USER_AUTH', data);
    publishToQueue('UPDATE_USER_CHAT', data);
    publishToQueue('UPDATE_USER_POST', data);

    res.status(200).send('Profile updated successfully');
  ***REMOVED*** catch (error) ***REMOVED***
    next(error)
  ***REMOVED***
***REMOVED***

/**
 * fetch following between two profiles
 * @param req
 * @param res
 * @param next
 */
export const fetchFollow = async (req, res, next) => ***REMOVED***

  try ***REMOVED***
    const follower = req.params.id1;
    const following = req.params.id2;

    const follow = await Follow.findOne(***REMOVED*** follower: follower, following: following ***REMOVED***);
    if (!follow) ***REMOVED***
      throw httpError.NotFound();
    ***REMOVED***

    res.status(200).send(***REMOVED*** follow ***REMOVED***);
  ***REMOVED*** catch (error) ***REMOVED***
    next(error);
  ***REMOVED***
***REMOVED***

/**
 * create following between two profiles
 * @param req
 * @param res
 * @param next
 */
export const createFollow = async (req, res, next) => ***REMOVED***

  try ***REMOVED***
    const follower = req.authUser;
    const following = req.params.id;

    const profile = await Profile.findOne(***REMOVED*** userId: following ***REMOVED***);

    if (!profile) ***REMOVED***
      throw httpError.NotFound(`Profile you're trying to follow does not exist`);
    ***REMOVED***

    const ***REMOVED*** isPublic ***REMOVED*** = profile;

    const status = isPublic ? 'accepted' : 'pending';

    const follow = new Follow(***REMOVED***
      follower: follower,
      following: following,
      status: status,
      createdAt: new Date().toISOString()
    ***REMOVED***);

    const followingSaved = await follow.save();

    res.status(201).send(followingSaved);
  ***REMOVED*** catch (error) ***REMOVED***
    next(error)
  ***REMOVED***
***REMOVED***

/** 
 * unfollow profile
 * @param ***REMOVED*******REMOVED*** req 
 * @param ***REMOVED*******REMOVED*** res 
 * @param ***REMOVED*******REMOVED*** next 
 */
export const unFollow = async (req, res, next) => ***REMOVED***
  try ***REMOVED***
    const follower = req.authUser;
    const following = req.params.id;
    const ***REMOVED*** relation ***REMOVED*** = req.body;

    if (!relation) ***REMOVED***
      throw httpError.BadRequest('Payload missing relation');
    ***REMOVED***

    let follow;
    if (relation === 'follower') ***REMOVED***
      follow = await Follow.findOne(***REMOVED*** follower: follower, following: following ***REMOVED***);
    ***REMOVED*** else if (relation === 'following') ***REMOVED***
      follow = await Follow.findOne(***REMOVED*** following: follower, follower: following ***REMOVED***);
    ***REMOVED***

    if (!follow) ***REMOVED***
      throw httpError.NotFound();
    ***REMOVED***

    await follow.delete();

    res.status(202).send('Profile unfollowed');
  ***REMOVED*** catch (error) ***REMOVED***
    next(error);
  ***REMOVED***
***REMOVED***;

/**
 * fetch followings by userId
 * @param ***REMOVED*******REMOVED*** req 
 * @param ***REMOVED*******REMOVED*** res 
 * @param ***REMOVED*******REMOVED*** next 
 */
export const fetchFollowings = async (req, res, next) => ***REMOVED***
  try ***REMOVED***
    const ***REMOVED*** status ***REMOVED*** = req.body;
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
      throw httpError.BadRequest();
    ***REMOVED***
    const profile = await Profile.findOne(***REMOVED*** userId: id ***REMOVED***);

    if (!profile) ***REMOVED***
      throw httpError.NotFound();
    ***REMOVED***

    let data;
    if (status)
      data = await Follow.paginate(***REMOVED*** follower: id, status: status ***REMOVED***, options);
    else
      data = await Follow.paginate(***REMOVED*** follower: id ***REMOVED***, options);

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
 * fetch followings by userId
 * @param ***REMOVED*******REMOVED*** req 
 * @param ***REMOVED*******REMOVED*** res 
 * @param ***REMOVED*******REMOVED*** next 
 */
export const fetchFollowers = async (req, res, next) => ***REMOVED***
  try ***REMOVED***
    const ***REMOVED*** status ***REMOVED*** = req.body;
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
      throw httpError.BadRequest();
    ***REMOVED***
    const profile = await Profile.findOne(***REMOVED*** userId: id ***REMOVED***);

    if (!profile) ***REMOVED***
      throw httpError.NotFound();
    ***REMOVED***

    let data;
    if (status)
      data = await Follow.paginate(***REMOVED*** following: id, status: status ***REMOVED***, options);
    else
      data = await Follow.paginate(***REMOVED*** following: id ***REMOVED***, options);

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
 * accept pending following
 * @param req
 * @param res
 * @param next
 */
export const acceptFollowing = async (req, res, next) => ***REMOVED***
  try ***REMOVED***
    const userId = req.authUser;

    let ***REMOVED*** id ***REMOVED*** = req.params;

    if (!id) ***REMOVED***
      throw httpError.BadRequest();
    ***REMOVED***

    await Follow.findOneAndUpdate(
      ***REMOVED*** following: userId, _id: id ***REMOVED***,
      ***REMOVED***
        $set: ***REMOVED***
          status: 'accepted'
        ***REMOVED***
      ***REMOVED***
      , ***REMOVED***
        upsert: true
      ***REMOVED***
    );

    res.status(201).send('Following accepted');
  ***REMOVED*** catch (error) ***REMOVED***
    next(error)
  ***REMOVED***
***REMOVED***

/**
 * reject pending following
 * @param req
 * @param res
 * @param next
 */
export const rejectFollowing = async (req, res, next) => ***REMOVED***
  try ***REMOVED***
    const userId = req.authUser;
    let ***REMOVED*** id ***REMOVED*** = req.params;

    const follow = await Follow.findOne(***REMOVED*** following: userId, _id: id ***REMOVED***);
    if (!follow) ***REMOVED***
      throw httpError.NotFound();
    ***REMOVED***

    await follow.delete();

    res.status(202).send('Follow request deleted');
  ***REMOVED*** catch (error) ***REMOVED***
    next(error);
  ***REMOVED***
***REMOVED***