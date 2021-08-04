import express from 'express';
import ***REMOVED*** home, login, logout, register, refreshToken, forgotPassword, resetPassword, verifyAccount ***REMOVED*** from '../controllers/Auth.js';
import ***REMOVED*** verifyAccessToken ***REMOVED*** from '../utils/jwt.js';

const authRoute = express.Router();
authRoute.get('/', verifyAccessToken, home); //protected with jwt
authRoute.post('/login', login);
authRoute.delete('/logout', logout);
authRoute.post('/register', register);
authRoute.post('/auth/refresh-token', refreshToken);
authRoute.post('/auth/forgot-password', forgotPassword);
authRoute.post('/auth/forgot-password/:id/:token', resetPassword);

authRoute.get('/auth/verify-account/:id/:token', verifyAccount);

export default authRoute;
