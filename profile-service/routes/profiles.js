import express from 'express';

import { verifyAccessToken } from '../utils/jwt.js';
import {createProfile,fetchProfileByUserId, fetchProfileByQueryParams, updateProfile} from '../controllers/profiles.js';

const profileRoute = express.Router();

profileRoute.get('/',(req,res)=>{
  res.status(200).send('Welcome');
})

profileRoute.post('/profiles/new',verifyAccessToken,createProfile);
profileRoute.get('/profiles/users/:id/',verifyAccessToken,fetchProfileByUserId);
profileRoute.get('/profiles/user',verifyAccessToken,fetchProfileByQueryParams);
profileRoute.patch('/profiles/update',verifyAccessToken,updateProfile);

export default profileRoute;
