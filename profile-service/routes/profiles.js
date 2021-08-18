import express from 'express';

import { verifyAccessToken } from '../utils/jwt.js';
import { createProfile, fetchProfileByUserId, fetchProfileByQueryParams, updateProfile } from '../controllers/profiles.js';

const profileRoute = express.Router();

profileRoute.get('/', (req, res) => {
  res.status(200).send('Welcome');
})

profileRoute.post('/api/profiles/new', verifyAccessToken, createProfile);
profileRoute.get('/api/profiles/users/:id/', verifyAccessToken, fetchProfileByUserId);
profileRoute.get('/api/profiles/user', verifyAccessToken, fetchProfileByQueryParams);
profileRoute.patch('/api/profiles/update', verifyAccessToken, updateProfile);

export default profileRoute;
