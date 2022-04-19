import express from 'express';
import mongoose from 'mongoose';
import createError from 'http-errors';
import { validateLogin, validateRegister } from '../utils/validator.js';
import lodash from 'lodash';
import moment from 'moment';


import User from '../models/users.js'
import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    signPasswordResetToken,
    verifyPasswordResetToken,
    deleteRefreshToken,
    signAccountConfirmationToken,
    verifyAccountConfirmationToken
} from '../utils/jwt.js'
import { publishToQueue } from '../utils/rabbitmq.js'

const router = express.Router();

export const home = async (req, res, next) => {
    res.send('Welcome!');
}

/**
 * returns the user object for current authenticated user
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const me = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.authUser });
        const result = lodash.pick(user, ['name', 'email', 'username', '_id', 'isVerified']);
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
}

/**
 * logs in user and generates a pair of access and refresh tokens
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        await validateLogin(email, password)

        const user = await User.findOne({ email });
        if (!user) {
            throw createError.Unauthorized('Invalid username or password');
        }

        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            throw createError.Unauthorized('Invalid username or password');
        }

        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);
        res.status(200).send({ accessToken, refreshToken });

    } catch (error) {
        console.log(error)
        next(error);
    }
}

/**
 * registers user in the backend and propagate to other microservices
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        //validate destructured fields 
        await validateRegister(email, username, password);

        //check if user already exists and throw error if so
        let doesExist = await User.findOne({ email });
        if (doesExist) {
            throw createError.Conflict(`${email} already exists`);
        }

        doesExist = await User.findOne({ username });
        if (doesExist) {
            throw createError.Conflict(`${username} already exists`);
        }

        //otherwise save user into database and send a successful response
        const user = new User(req.body);
        const savedUser = await user.save();
        const accessToken = await signAccessToken(savedUser.id)
        const refreshToken = await signRefreshToken(savedUser.id);


        const verifyAccountToken = await signAccountConfirmationToken(savedUser.id);
        const expiry = moment().add(24, 'hours').valueOf();
        const uri = await buildUri(savedUser, expiry, verifyAccountToken, 'verify-account');

        if (savedUser && savedUser._id) {
            //prepare payload for user table in other microservices
            let data = {
                userId: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                username: savedUser.username,
            }
            publishToQueue('USER_CHAT', data);
            publishToQueue('USER_POST', data);
            publishToQueue('USER_PROFILE', data);

            // prepare payload for the email service
            data = {
                name: savedUser.name,
                email: savedUser.email,
                username: savedUser.username,
                subject: 'Welcome!',
                uri: uri
            }
            publishToQueue('SIGN_UP', data);
        }

        res.status(201).send({ accessToken, refreshToken });

    } catch (error) {
        next(error)
    }
}

/**
 * sends user email with a unique token to verify account
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const verifyByUserId = async (req, res, next) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            throw createError.BadRequest();
        }

        const user = await User.findOne({ '_id': userId });
        if (!user) {
            //if user is not registered, just send successful response, and avoid having a security hole
            res.status(200).send();
        }

        const verifyAccountToken = await signAccountConfirmationToken(user.id);
        const expiry = moment().add(24, 'hours').valueOf();
        const uri = await buildUri(user, expiry, verifyAccountToken, 'verify-account');

        // prepare payload for queue
        const data = {
            name: user.name,
            email: user.email,
            subject: 'Welcome!',
            uri: uri
        }
        publishToQueue('SIGN_UP', data);

        res.status(200).send();
    } catch (error) {
        next(error)
    }
}

/**
 * logout route removes the refreshToken from the redis.
 * in the frontend we'll need to remove the access token from memory
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw createError.BadRequest();
        }
        const userId = await verifyRefreshToken(refreshToken);
        await deleteRefreshToken(userId);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

/**
 * generates a new pair of accessToken and refreshToken
 * it a takes refresh token in the request payload
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw createError.BadRequest();
        }

        const userId = await verifyRefreshToken(refreshToken);
        const accessToken = await signAccessToken(userId);
        const newRefreshToken = await signRefreshToken(userId);
        res.status(200).send({ accessToken, 'refreshToken': newRefreshToken });

    } catch (error) {
        next(error);
    }
}


/**
 * sends user email with a unique token to reset password
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw createError.BadRequest();
        }

        const user = await User.findOne({ email });
        if (!user) {
            //if user is not registered, just send successful response, and avoid having a security hole
            res.status(200).send();
        }

        const accessToken = await signPasswordResetToken(user);
        const expiry = moment().add(10, 'minutes').valueOf();
        const uri = await buildUri(user, expiry, accessToken, 'reset-password');

        // prepare payload for queue
        const data = {
            name: user.name,
            email: user.email,
            subject: 'Forgot your password?',
            uri: uri
        }
        publishToQueue('RESET_PASSWORD', data);

        res.status(200).send();
    } catch (error) {
        next(error)
    }
}

/**
 * sends user email with a unique token to reset password
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const forgotPasswordWithUserId = async (req, res, next) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            throw createError.BadRequest();
        }

        const user = await User.findOne({ '_id': userId });
        if (!user) {
            //if user is not registered, just send successful response, and avoid having a security hole
            res.status(200).send();
        }

        const accessToken = await signPasswordResetToken(user);
        const expiry = moment().add(10, 'minutes').valueOf();
        const uri = await buildUri(user, expiry, accessToken, 'reset-password');

        // prepare payload for queue
        const data = {
            name: user.name,
            email: user.email,
            subject: 'Forgot your password?',
            uri: uri
        }
        publishToQueue('RESET_PASSWORD', data);

        res.status(200).send();
    } catch (error) {
        next(error)
    }
}

const buildUri = async (user, expiry, token, path) => {
    const PORT = process.env.PORT;
    const params = 'userId=' + user._id + '&code=' + token + '&expiry=' + expiry;
    const uri = 'instagramclone://' + path + '?' + params;

    return uri;
}

/**
 * protected route to resets user password
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const resetPassword = async (req, res, next) => {
    try {
        const { password } = req.body;
        const { id, token } = req.params;

        if (!password) {
            throw createError.BadRequest();
        }

        let user = await User.findOne({ '_id': id });

        if (!user) {
            throw createError.Unauthorized();
        }

        await verifyPasswordResetToken(user, token);

        user.password = password;
        await user.save();

        res.status(201).send('Password Reset');
    } catch (error) {
        next(error)
    }
}

export const verifyAccount = async (req, res, next) => {
    const { id, token } = req.params;

    try {
        const user = await User.findOne({ '_id': id });

        if (!user) {
            throw createError.Unauthorized();
        }

        await verifyAccountConfirmationToken(token);

        user.isVerified = true;
        await user.save();

        res.status(201).send('Account verified');
    } catch (error) {
        next(error);
    }
}