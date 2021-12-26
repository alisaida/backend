import express from 'express';

import ***REMOVED*** verifyAccessToken ***REMOVED*** from '../utils/jwt.js';
import ***REMOVED*** createProfile, fetchProfileByUserId, fetchProfileByQueryParams, updateProfilePicture, updateProfileBio, home, me ***REMOVED*** from '../controllers/profiles.js';

const profileRoute = express.Router();

profileRoute.get('/api/profiles', home);
profileRoute.get('/api/profiles/me', verifyAccessToken, me);
profileRoute.post('/api/profiles/new', verifyAccessToken, createProfile);
profileRoute.get('/api/profiles/users/:id/', verifyAccessToken, fetchProfileByUserId);
profileRoute.get('/api/profiles/user', verifyAccessToken, fetchProfileByQueryParams);
profileRoute.patch('/api/profiles/profilePicture', verifyAccessToken, updateProfilePicture);
profileRoute.patch('/api/profiles/bio', verifyAccessToken, updateProfileBio);

export default profileRoute;
