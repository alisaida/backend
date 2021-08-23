import express from 'express';

import { verifyAccessToken } from '../utils/jwt.js';
import { createProfile, fetchProfileByUserId, fetchProfileByQueryParams, updateProfile, home, me } from '../controllers/profiles.js';

const profileRoute = express.Router();

profileRoute.get('/api/profiles', home);
profileRoute.get('/api/profiles/me', verifyAccessToken, me);
profileRoute.post('/api/profiles/new', verifyAccessToken, createProfile);
profileRoute.get('/api/profiles/users/:id/', verifyAccessToken, fetchProfileByUserId);
profileRoute.get('/api/profiles/user', verifyAccessToken, fetchProfileByQueryParams);
profileRoute.patch('/api/profiles/update', verifyAccessToken, updateProfile);

export default profileRoute;
