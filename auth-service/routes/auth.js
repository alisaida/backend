import express from 'express';
import ***REMOVED*** home, login, logout, register, refreshToken, forgotPassword, resetPassword, verifyAccount ***REMOVED*** from '../controllers/Auth.js';
import ***REMOVED*** verifyAccessToken ***REMOVED*** from '../utils/jwt.js';

const authRoute = express.Router();
authRoute.get('/', verifyAccessToken, home); //protected with jwt
authRoute.post('/api/auth/login', login);
authRoute.post('/api/auth/logout', logout);
authRoute.post('/api/auth/register', register);
authRoute.post('/api/auth/refresh-token', refreshToken);
authRoute.post('/api/auth/forgot-password', forgotPassword);
authRoute.post('/api/auth/forgot-password/:id/:token', resetPassword);
authRoute.get('/api/auth/verify-account/:id/:token', verifyAccount);

export default authRoute;
