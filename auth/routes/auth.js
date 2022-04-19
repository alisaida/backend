import express from 'express';
import ***REMOVED*** home, login, logout, register, refreshToken, forgotPassword, resetPassword, verifyAccount, me, forgotPasswordWithUserId, verifyByUserId ***REMOVED*** from '../controllers/auth.js';
import ***REMOVED*** verifyAccessToken ***REMOVED*** from '../utils/jwt.js';

const authRoute = express.Router();
authRoute.get('/api/auth/', home);
authRoute.get('/api/auth/me', verifyAccessToken, me);
authRoute.post('/api/auth/login', login);
authRoute.post('/api/auth/logout', logout);
authRoute.post('/api/auth/register', register);
authRoute.post('/api/auth/refresh-token', refreshToken);
authRoute.post('/api/auth/forgot-password', forgotPassword);
authRoute.post('/api/auth/forgot-pass', forgotPasswordWithUserId);
authRoute.post('/api/auth/forgot-password/:id/:token', resetPassword);
authRoute.post('/api/auth/verify-account/:id/:token', verifyAccount);
authRoute.post('/api/auth/verify-account/', verifyByUserId);

export default authRoute;
