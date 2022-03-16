import JWT from 'jsonwebtoken';
import createError from 'http-errors';

// import redisClient from '../utils/redis-client.js';

/**
 * signs access token
 * @param {*} userId 
 * @returns 
 */
export const signAccessToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {}

        const secret = process.env.ACCESS_TOKEN_SECRET;
        const expiresIn = process.env.NODE_ENV === 'dev' ? '1hr' : '15m';

        const options = {
            expiresIn: expiresIn,
            audience: userId,
            issuer: 'https://www.saida.dev'
        }

        JWT.sign(payload, secret, options, (error, token) => {
            if (error) {
                console.log(error);
                reject(createError.InternalServerError());
            }
            resolve(token);
        })
    })
}

/**
 * signs access token
 * @param {*} userId 
 * @returns 
 */
export const signRefreshToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {}

        const secret = process.env.REFRESH_TOKEN_SECRET;

        const options = {
            expiresIn: '7d',
            audience: userId,
            issuer: 'https://www.saida.dev'
        }

        JWT.sign(payload, secret, options, (error, token) => {
            if (error) {
                console.log(error);
                reject(createError.InternalServerError());
            }

            // guard against reusing the same refresh token multiple times, alway over write it
            redisClient.SET(userId, token, 'EX', 60 * 60 * 24 * 7, (error, reply) => {
                if (error) {
                    console.log(error.message);
                    return reject(createError.InternalServerError());
                }

                resolve(token);
            })
        })
    })
}

/**
 * verifies access token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const verifyAccessToken = (req, res, next) => {
    const headers = req.headers;

    if (!headers['authorization'])
        throw createError.Unauthorized()

    //authorization header: 'Bearer TOKEN'
    const token = headers['authorization'].split(' ')[1];
    const secret = process.env.ACCESS_TOKEN_SECRET;

    JWT.verify(token, secret, (error, jwtPayload) => {

        if (error) {
            const errMessage = error.name === 'JsonWebTokenError' ? 'Unauthorized' : 'Expired jwt';
            next(createError.Unauthorized(errMessage));
        } else {
            req.jwtPayload = jwtPayload;
            req.authUser = jwtPayload.aud;
            next();
        }

    })
}

/**
 * verifies refresh token
 * @param {*} token 
 * @returns 
 */
export const verifyRefreshToken = (token) => {
    return new Promise((resolve, reject) => {
        const secret = process.env.REFRESH_TOKEN_SECRET;

        JWT.verify(token, secret, (error, jwtPayload) => {
            if (error) {
                return reject(createError.Unauthorized());
            }

            const userId = jwtPayload.aud;
            redisClient.GET(userId, (error, reply) => {
                if (error) {
                    console.log(error.message);
                    return reject(createError.InternalServerError());
                }

                // check if refresh token same as whats in the redis cache i.e. generated once
                if (token === reply) {
                    return resolve(userId);
                }
                reject(createError.Unauthorized());
            })

        });
    })
}

/**
 * signs a short expiry jwt used to reset password
 * @param {*} user 
 * @returns 
 */
export const signPasswordResetToken = (user) => {
    return new Promise((resolve, reject) => {

        const payload = {
            email: user.email,
            id: user._id
        }
        const secret = process.env.PASSWORD_RESET_SECRET + user.password;
        const options = {
            expiresIn: '10m',
            audience: user._id + '',
            issuer: 'https://www.saida.dev'
        }

        JWT.sign(payload, secret, options, (error, token) => {
            if (error) {
                console.log(error);
                reject(createError.InternalServerError());
            }
            resolve(token);
        })
    });
}

/**
 * verifies jwt for resetting password
 * @param {*} user 
 * @param {*} token 
 * @returns 
 */
export const verifyPasswordResetToken = (user, token) => {
    return new Promise((resolve, reject) => {
        const secret = process.env.PASSWORD_RESET_SECRET + user.password;
        JWT.verify(token, secret, (error, jwtPayload) => {
            if (error) {
                return reject(createError.Unauthorized());
            }
            resolve();
        })
    })
}

/**
 * removes jwt from redis
 * @param {*} userId 
 * @returns 
 */
export const deleteRefreshToken = (userId) => {
    return new Promise((resolve, reject) => {
        redisClient.DEL(userId, (error, reply) => {
            if (error) {
                console.log(error.message);
                return reject(createError.InternalServerError());
            }
            resolve();
        })
    })
}

/**
 * signs a short expiry jwt used in the account sign up email
 * @param {*} user 
 * @returns 
 */
export const signAccountConfirmationToken = (user) => {
    return new Promise((resolve, reject) => {

        const payload = {}
        const secret = process.env.ACCOUNT_VERIFICATION_SECRET;
        const options = {
            expiresIn: '10m',
            audience: user._id + '',
            issuer: 'https://www.saida.dev'
        }

        JWT.sign(payload, secret, options, (error, token) => {
            if (error) {
                console.log(error);
                reject(createError.InternalServerError());
            }
            resolve(token);
        })
    });
}

/**
 * verifies jwt for account sign up email
 * @param {*} user 
 * @param {*} token 
 * @returns 
 */
export const verifyAccountConfirmationToken = (token) => {
    return new Promise((resolve, reject) => {

        const secret = process.env.ACCOUNT_VERIFICATION_SECRET;
        JWT.verify(token, secret, (error, jwtPayload) => {
            if (error) {
                return reject(createError.Unauthorized());
            }
            resolve();
        })
    })
}
