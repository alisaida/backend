import express from 'express';

import { verifyAccessToken } from '../utils/jwt.js';
import { createProfile, fetchProfileByUserId, searchProfile, searchProfileByName, searchProfileByUsername, updateProfile, updateProfilePicture, updateProfileBio, home, me, fetchFollow, createFollow, unFollow, fetchFollowings, fetchFollowers, acceptFollowing, rejectFollowing } from '../controllers/profiles.js';

const profileRoute = express.Router();

profileRoute.get('/api/profiles', home);
profileRoute.get('/api/profiles/me', verifyAccessToken, me);
profileRoute.post('/api/profiles/new', verifyAccessToken, createProfile);
profileRoute.get('/api/profiles/users/:id/', verifyAccessToken, fetchProfileByUserId);
profileRoute.get('/api/profiles/search', verifyAccessToken, searchProfile);
profileRoute.get('/api/profiles/searchByName', verifyAccessToken, searchProfileByName);
profileRoute.get('/api/profiles/searchByUsername', verifyAccessToken, searchProfileByUsername);
profileRoute.patch('/api/profiles/profilePicture', verifyAccessToken, updateProfilePicture);
profileRoute.post('/api/profiles/update', verifyAccessToken, updateProfile);
profileRoute.patch('/api/profiles/bio', verifyAccessToken, updateProfileBio);

profileRoute.get('/api/profiles/:id1/follow/:id2', verifyAccessToken, fetchFollow);
profileRoute.post('/api/profiles/:id/follow', verifyAccessToken, createFollow);
profileRoute.post('/api/profiles/follow/:id/unfollow', verifyAccessToken, unFollow);
profileRoute.patch('/api/profiles/follow/:id/accept', verifyAccessToken, acceptFollowing);
profileRoute.delete('/api/profiles/follow/:id/reject', verifyAccessToken, rejectFollowing);
profileRoute.post('/api/profiles/:id/followers', verifyAccessToken, fetchFollowers);
profileRoute.post('/api/profiles/:id/followings', verifyAccessToken, fetchFollowings);

export default profileRoute;
