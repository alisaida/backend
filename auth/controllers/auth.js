import express from 'express';
import mongoose from 'mongoose';
import createError from 'http-errors';
import ***REMOVED*** validateLogin, validateRegister ***REMOVED*** from '../utils/validator.js';
import lodash from 'lodash';
import moment from 'moment';


import User from '../models/users.js'
import ***REMOVED***
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    signPasswordResetToken,
    verifyPasswordResetToken,
    deleteRefreshToken,
    signAccountConfirmationToken,
    verifyAccountConfirmationToken
***REMOVED*** from '../utils/jwt.js'
import ***REMOVED*** publishToQueue ***REMOVED*** from '../utils/rabbitmq.js'

const router = express.Router();

export const home = async (req, res, next) => ***REMOVED***
    res.send('Welcome!');
***REMOVED***

/**
 * returns the user object for current authenticated user
 * @param ***REMOVED*******REMOVED*** req 
 * @param ***REMOVED*******REMOVED*** res 
 * @param ***REMOVED*******REMOVED*** next 
 */
export const me = async (req, res, next) => ***REMOVED***
    try ***REMOVED***
        const user = await User.findOne(***REMOVED*** _id: req.authUser ***REMOVED***);
        const result = lodash.pick(user, ['name', 'email', 'username', '_id', 'isVerified']);
        res.status(200).send(result);
    ***REMOVED*** catch (err) ***REMOVED***
        next(err);
    ***REMOVED***
***REMOVED***

/**
 * logs in user and generates a pair of access and refresh tokens
 * @param ***REMOVED*******REMOVED*** req 
 * @param ***REMOVED*******REMOVED*** res 
 * @param ***REMOVED*******REMOVED*** next 
 */
export const login = async (req, res, next) => ***REMOVED***
    try ***REMOVED***
        const ***REMOVED*** email, password ***REMOVED*** = req.body;
        await validateLogin(email, password)

        const user = await User.findOne(***REMOVED*** email ***REMOVED***);
        if (!user) ***REMOVED***
            throw createError.Unauthorized('Invalid username or password');
        ***REMOVED***

        const isMatch = await user.isValidPassword(password);
        if (!isMatch) ***REMOVED***
            throw createError.Unauthorized('Invalid username or password');
        ***REMOVED***

        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);
        res.status(200).send(***REMOVED*** accessToken, refreshToken ***REMOVED***);

    ***REMOVED*** catch (error) ***REMOVED***
        console.log(error)
        next(error);
    ***REMOVED***
***REMOVED***

/**
 * registers user in the backend and propagate to other microservices
 * @param ***REMOVED*******REMOVED*** req 
 * @param ***REMOVED*******REMOVED*** res 
 * @param ***REMOVED*******REMOVED*** next 
 */
export const register = async (req, res, next) => ***REMOVED***
    try ***REMOVED***
        const ***REMOVED*** email, username, password ***REMOVED*** = req.body;
        //validate destructured fields 
        await validateRegister(email, username, password);

        //check if user already exists and throw error if so
        let doesExist = await User.findOne(***REMOVED*** email ***REMOVED***);
        if (doesExist) ***REMOVED***
            throw createError.Conflict(`$***REMOVED***email***REMOVED*** already exists`);
        ***REMOVED***

        doesExist = await User.findOne(***REMOVED*** username ***REMOVED***);
        if (doesExist) ***REMOVED***
            throw createError.Conflict(`$***REMOVED***username***REMOVED*** already exists`);
        ***REMOVED***

        //otherwise save user into database and send a successful response
        const user = new User(req.body);
        const savedUser = await user.save();
        const accessToken = await signAccessToken(savedUser.id)
        const refreshToken = await signRefreshToken(savedUser.id);


        const verifyAccountToken = await signAccountConfirmationToken(savedUser.id);
        const expiry = moment().add(24, 'hours').valueOf();
        const uri = await buildUri(savedUser, expiry, verifyAccountToken, 'verify-account');

        if (savedUser && savedUser._id) ***REMOVED***
            //prepare payload for user table in other microservices
            let data = ***REMOVED***
                userId: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                username: savedUser.username,
            ***REMOVED***
            publishToQueue('USER_CHAT', data);
            publishToQueue('USER_POST', data);
            publishToQueue('USER_PROFILE', data);

            // prepare payload for the email service
            data = ***REMOVED***
                name: savedUser.name,
                email: savedUser.email,
                username: savedUser.username,
                subject: 'Welcome!',
                uri: uri
            ***REMOVED***
            publishToQueue('SIGN_UP', data);
        ***REMOVED***

        res.status(201).send(***REMOVED*** accessToken, refreshToken ***REMOVED***);

    ***REMOVED*** catch (error) ***REMOVED***
        next(error)
    ***REMOVED***
***REMOVED***

/**
 * sends user email with a unique token to verify account
 * @param ***REMOVED*******REMOVED*** req 
 * @param ***REMOVED*******REMOVED*** res 
 * @param ***REMOVED*******REMOVED*** next 
 */
export const verifyByUserId = async (req, res, next) => ***REMOVED***
    try ***REMOVED***
        const ***REMOVED*** userId ***REMOVED*** = req.body;

        if (!userId) ***REMOVED***
            throw createError.BadRequest();
        ***REMOVED***

        const user = await User.findOne(***REMOVED*** '_id': userId ***REMOVED***);
        if (!user) ***REMOVED***
            //if user is not registered, just send successful response, and avoid having a security hole
            res.status(200).send();
        ***REMOVED***

        const verifyAccountToken = await signAccountConfirmationToken(user.id);
        const expiry = moment().add(24, 'hours').valueOf();
        const uri = await buildUri(user, expiry, verifyAccountToken, 'verify-account');

        // prepare payload for queue
        const data = ***REMOVED***
            name: user.name,
            email: user.email,
            subject: 'Welcome!',
            uri: uri
        ***REMOVED***
        publishToQueue('SIGN_UP', data);

        res.status(200).send();
    ***REMOVED*** catch (error) ***REMOVED***
        next(error)
    ***REMOVED***
***REMOVED***

/**
 * logout route removes the refreshToken from the redis.
 * in the frontend we'll need to remove the access token from memory
 * @param ***REMOVED*******REMOVED*** req 
 * @param ***REMOVED*******REMOVED*** res 
 * @param ***REMOVED*******REMOVED*** next 
 */
export const logout = async (req, res, next) => ***REMOVED***
    try ***REMOVED***
        const ***REMOVED*** refreshToken ***REMOVED*** = req.body;
        if (!refreshToken) ***REMOVED***
            throw createError.BadRequest();
        ***REMOVED***
        const userId = await verifyRefreshToken(refreshToken);
        await deleteRefreshToken(userId);

        res.status(204).send();
    ***REMOVED*** catch (error) ***REMOVED***
        next(error);
    ***REMOVED***
***REMOVED***

/**
 * generates a new pair of accessToken and refreshToken
 * it a takes refresh token in the request payload
 * @param ***REMOVED*******REMOVED*** req 
 * @param ***REMOVED*******REMOVED*** res 
 * @param ***REMOVED*******REMOVED*** next 
 */
export const refreshToken = async (req, res, next) => ***REMOVED***
    try ***REMOVED***
        const ***REMOVED*** refreshToken ***REMOVED*** = req.body;
        if (!refreshToken) ***REMOVED***
            throw createError.BadRequest();
        ***REMOVED***

        const userId = await verifyRefreshToken(refreshToken);
        const accessToken = await signAccessToken(userId);
        const newRefreshToken = await signRefreshToken(userId);
        res.status(200).send(***REMOVED*** accessToken, 'refreshToken': newRefreshToken ***REMOVED***);

    ***REMOVED*** catch (error) ***REMOVED***
        next(error);
    ***REMOVED***
***REMOVED***


/**
 * sends user email with a unique token to reset password
 * @param ***REMOVED*******REMOVED*** req 
 * @param ***REMOVED*******REMOVED*** res 
 * @param ***REMOVED*******REMOVED*** next 
 */
export const forgotPassword = async (req, res, next) => ***REMOVED***
    try ***REMOVED***
        const ***REMOVED*** email ***REMOVED*** = req.body;

        if (!email) ***REMOVED***
            throw createError.BadRequest();
        ***REMOVED***

        const user = await User.findOne(***REMOVED*** email ***REMOVED***);
        if (!user) ***REMOVED***
            //if user is not registered, just send successful response, and avoid having a security hole
            res.status(200).send();
        ***REMOVED***

        const accessToken = await signPasswordResetToken(user);
        const expiry = moment().add(10, 'minutes').valueOf();
        const uri = await buildUri(user, expiry, accessToken, 'reset-password');

        // prepare payload for queue
        const data = ***REMOVED***
            name: user.name,
            email: user.email,
            subject: 'Forgot your password?',
            uri: uri
        ***REMOVED***
        publishToQueue('RESET_PASSWORD', data);

        res.status(200).send();
    ***REMOVED*** catch (error) ***REMOVED***
        next(error)
    ***REMOVED***
***REMOVED***

/**
 * sends user email with a unique token to reset password
 * @param ***REMOVED*******REMOVED*** req 
 * @param ***REMOVED*******REMOVED*** res 
 * @param ***REMOVED*******REMOVED*** next 
 */
export const forgotPasswordWithUserId = async (req, res, next) => ***REMOVED***
    try ***REMOVED***
        const ***REMOVED*** userId ***REMOVED*** = req.body;

        if (!userId) ***REMOVED***
            throw createError.BadRequest();
        ***REMOVED***

        const user = await User.findOne(***REMOVED*** '_id': userId ***REMOVED***);
        if (!user) ***REMOVED***
            //if user is not registered, just send successful response, and avoid having a security hole
            res.status(200).send();
        ***REMOVED***

        const accessToken = await signPasswordResetToken(user);
        const expiry = moment().add(10, 'minutes').valueOf();
        const uri = await buildUri(user, expiry, accessToken, 'reset-password');

        // prepare payload for queue
        const data = ***REMOVED***
            name: user.name,
            email: user.email,
            subject: 'Forgot your password?',
            uri: uri
        ***REMOVED***
        publishToQueue('RESET_PASSWORD', data);

        res.status(200).send();
    ***REMOVED*** catch (error) ***REMOVED***
        next(error)
    ***REMOVED***
***REMOVED***

const buildUri = async (user, expiry, token, path) => ***REMOVED***
    const PORT = process.env.PORT;
    const params = 'userId=' + user._id + '&code=' + token + '&expiry=' + expiry;
    const uri = 'instagramclone://' + path + '?' + params;

    return uri;
***REMOVED***

/**
 * protected route to resets user password
 * @param ***REMOVED*******REMOVED*** req 
 * @param ***REMOVED*******REMOVED*** res 
 * @param ***REMOVED*******REMOVED*** next 
 */
export const resetPassword = async (req, res, next) => ***REMOVED***
    try ***REMOVED***
        const ***REMOVED*** password ***REMOVED*** = req.body;
        const ***REMOVED*** id, token ***REMOVED*** = req.params;

        if (!password) ***REMOVED***
            throw createError.BadRequest();
        ***REMOVED***

        let user = await User.findOne(***REMOVED*** '_id': id ***REMOVED***);

        if (!user) ***REMOVED***
            throw createError.Unauthorized();
        ***REMOVED***

        await verifyPasswordResetToken(user, token);

        user.password = password;
        await user.save();

        res.status(201).send('Password Reset');
    ***REMOVED*** catch (error) ***REMOVED***
        next(error)
    ***REMOVED***
***REMOVED***

export const verifyAccount = async (req, res, next) => ***REMOVED***
    const ***REMOVED*** id, token ***REMOVED*** = req.params;

    try ***REMOVED***
        const user = await User.findOne(***REMOVED*** '_id': id ***REMOVED***);

        if (!user) ***REMOVED***
            throw createError.Unauthorized();
        ***REMOVED***

        await verifyAccountConfirmationToken(token);

        user.isVerified = true;
        await user.save();

        res.status(201).send('Account verified');
    ***REMOVED*** catch (error) ***REMOVED***
        next(error);
    ***REMOVED***
***REMOVED***