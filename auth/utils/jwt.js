import JWT from 'jsonwebtoken';
import createError from 'http-errors';

import redisClient from '../utils/redis-client.js';

/**
 * signs access token
 * @param ***REMOVED*******REMOVED*** userId 
 * @returns 
 */
export const signAccessToken = (userId) => ***REMOVED***
    return new Promise((resolve, reject) => ***REMOVED***
        const payload = ***REMOVED******REMOVED***

        const secret = process.env.ACCESS_TOKEN_SECRET;
        const expiresIn = process.env.NODE_ENV === 'dev' ? '1hr' : '15m';

        const options = ***REMOVED***
            expiresIn: expiresIn,
            audience: userId,
            issuer: 'https://www.mywebsite.com'
        ***REMOVED***

        JWT.sign(payload, secret, options, (error, token) => ***REMOVED***
            if (error) ***REMOVED***
                console.log(error);
                reject(createError.InternalServerError());
            ***REMOVED***
            resolve(token);
        ***REMOVED***)
    ***REMOVED***)
***REMOVED***

/**
 * signs access token
 * @param ***REMOVED*******REMOVED*** userId 
 * @returns 
 */
export const signRefreshToken = (userId) => ***REMOVED***
    return new Promise((resolve, reject) => ***REMOVED***
        const payload = ***REMOVED******REMOVED***

        const secret = process.env.REFRESH_TOKEN_SECRET;

        const options = ***REMOVED***
            expiresIn: '7d',
            audience: userId,
            issuer: 'https://www.mywebsite.com'
        ***REMOVED***

        JWT.sign(payload, secret, options, (error, token) => ***REMOVED***
            if (error) ***REMOVED***
                console.log(error);
                reject(createError.InternalServerError());
            ***REMOVED***

            // guard against reusing the same refresh token multiple times, alway over write it
            redisClient.SET(userId, token, 'EX', 60 * 60 * 24 * 7, (error, reply) => ***REMOVED***
                if (error) ***REMOVED***
                    console.log(error.message);
                    return reject(createError.InternalServerError());
                ***REMOVED***

                resolve(token);
            ***REMOVED***)
        ***REMOVED***)
    ***REMOVED***)
***REMOVED***

/**
 * verifies access token
 * @param ***REMOVED*******REMOVED*** req 
 * @param ***REMOVED*******REMOVED*** res 
 * @param ***REMOVED*******REMOVED*** next 
 */
export const verifyAccessToken = (req, res, next) => ***REMOVED***
    const headers = req.headers;

    if (!headers['authorization'])
        throw createError.Unauthorized()

    //authorization header: 'Bearer TOKEN'
    const token = headers['authorization'].split(' ')[1];
    const secret = process.env.ACCESS_TOKEN_SECRET;

    JWT.verify(token, secret, (error, jwtPayload) => ***REMOVED***

        if (error) ***REMOVED***
            const errMessage = error.name === 'JsonWebTokenError' ? 'Unauthorized' : 'Expired jwt';
            next(createError.Unauthorized(errMessage));
        ***REMOVED*** else ***REMOVED***
            req.jwtPayload = jwtPayload;
            req.authUser = jwtPayload.aud;
            next();
        ***REMOVED***

    ***REMOVED***)
***REMOVED***

/**
 * verifies refresh token
 * @param ***REMOVED*******REMOVED*** token 
 * @returns 
 */
export const verifyRefreshToken = (token) => ***REMOVED***
    return new Promise((resolve, reject) => ***REMOVED***
        const secret = process.env.REFRESH_TOKEN_SECRET;

        JWT.verify(token, secret, (error, jwtPayload) => ***REMOVED***
            if (error) ***REMOVED***
                return reject(createError.Unauthorized());
            ***REMOVED***

            const userId = jwtPayload.aud;
            redisClient.GET(userId, (error, reply) => ***REMOVED***
                if (error) ***REMOVED***
                    console.log(error.message);
                    return reject(createError.InternalServerError());
                ***REMOVED***

                // check if refresh token same as whats in the redis cache i.e. generated once
                if (token === reply) ***REMOVED***
                    return resolve(userId);
                ***REMOVED***
                reject(createError.Unauthorized());
            ***REMOVED***)

        ***REMOVED***);
    ***REMOVED***)
***REMOVED***

/**
 * signs a short expiry jwt used to reset password
 * @param ***REMOVED*******REMOVED*** user 
 * @returns 
 */
export const signPasswordResetToken = (user) => ***REMOVED***
    return new Promise((resolve, reject) => ***REMOVED***

        const payload = ***REMOVED***
            email: user.email,
            id: user._id
        ***REMOVED***
        const secret = process.env.PASSWORD_RESET_SECRET + user.password;
        const options = ***REMOVED***
            expiresIn: '10m',
            audience: user._id + '',
            issuer: 'https://www.mywebsite.com'
        ***REMOVED***

        JWT.sign(payload, secret, options, (error, token) => ***REMOVED***
            if (error) ***REMOVED***
                console.log(error);
                reject(createError.InternalServerError());
            ***REMOVED***
            resolve(token);
        ***REMOVED***)
    ***REMOVED***);
***REMOVED***

/**
 * verifies jwt for resetting password
 * @param ***REMOVED*******REMOVED*** user 
 * @param ***REMOVED*******REMOVED*** token 
 * @returns 
 */
export const verifyPasswordResetToken = (user, token) => ***REMOVED***
    return new Promise((resolve, reject) => ***REMOVED***
        const secret = process.env.PASSWORD_RESET_SECRET + user.password;
        JWT.verify(token, secret, (error, jwtPayload) => ***REMOVED***
            if (error) ***REMOVED***
                return reject(createError.Unauthorized());
            ***REMOVED***
            resolve();
        ***REMOVED***)
    ***REMOVED***)
***REMOVED***

/**
 * removes jwt from redis
 * @param ***REMOVED*******REMOVED*** userId 
 * @returns 
 */
export const deleteRefreshToken = (userId) => ***REMOVED***
    return new Promise((resolve, reject) => ***REMOVED***
        redisClient.DEL(userId, (error, reply) => ***REMOVED***
            if (error) ***REMOVED***
                console.log(error.message);
                return reject(createError.InternalServerError());
            ***REMOVED***
            resolve();
        ***REMOVED***)
    ***REMOVED***)
***REMOVED***

/**
 * signs a short expiry jwt used in the account sign up email
 * @param ***REMOVED*******REMOVED*** user 
 * @returns 
 */
export const signAccountConfirmationToken = (user) => ***REMOVED***
    return new Promise((resolve, reject) => ***REMOVED***

        const payload = ***REMOVED******REMOVED***
        const secret = process.env.ACCOUNT_VERIFICATION_SECRET;
        const options = ***REMOVED***
            expiresIn: '10m',
            audience: user._id + '',
            issuer: 'https://www.mywebsite.com'
        ***REMOVED***

        JWT.sign(payload, secret, options, (error, token) => ***REMOVED***
            if (error) ***REMOVED***
                console.log(error);
                reject(createError.InternalServerError());
            ***REMOVED***
            resolve(token);
        ***REMOVED***)
    ***REMOVED***);
***REMOVED***

/**
 * verifies jwt for account sign up email
 * @param ***REMOVED*******REMOVED*** user 
 * @param ***REMOVED*******REMOVED*** token 
 * @returns 
 */
export const verifyAccountConfirmationToken = (token) => ***REMOVED***
    return new Promise((resolve, reject) => ***REMOVED***

        const secret = process.env.ACCOUNT_VERIFICATION_SECRET;
        JWT.verify(token, secret, (error, jwtPayload) => ***REMOVED***
            if (error) ***REMOVED***
                return reject(createError.Unauthorized());
            ***REMOVED***
            resolve();
        ***REMOVED***)
    ***REMOVED***)
***REMOVED***
