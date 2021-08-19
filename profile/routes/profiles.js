import express from 'express';

import ***REMOVED*** verifyAccessToken ***REMOVED*** from '../utils/jwt.js';
import ***REMOVED*** createProfile, fetchProfileByUserId, fetchProfileByQueryParams, updateProfile ***REMOVED*** from '../controllers/profiles.js';

const profileRoute = express.Router();

profileRoute.get('/', (req, res) => ***REMOVED***
  res.status(200).send('Welcome');
***REMOVED***)

profileRoute.post('/api/profiles/new', verifyAccessToken, createProfile);
profileRoute.get('/api/profiles/users/:id/', verifyAccessToken, fetchProfileByUserId);
profileRoute.get('/api/profiles/user', verifyAccessToken, fetchProfileByQueryParams);
profileRoute.patch('/api/profiles/update', verifyAccessToken, updateProfile);

export default profileRoute;