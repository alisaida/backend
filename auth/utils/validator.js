import createError from 'http-errors';
import validator from 'validator';

export const validateLogin = (email, password) => {
    return new Promise((resolve, reject) => {
        if (!email) {
            reject(createError.BadRequest('Please enter email'));
        }
        if (!validator.isEmail(email)) {
            reject(createError.BadRequest('Invalid email'));
        }
        if (!password) {
            reject(createError.BadRequest('Please enter password'));
        }
        resolve();
    })
}

export const validateRegister = (email, username, password) => {
    //regex to validate: alphanumeric _ (underscores) and . (dots) using negative look ahead
    const regexUsername = new RegExp('^[a-zA-Z0-9](_(?!(\.|_))|\.(?![_.])|[a-zA-Z0-9]){3,8}[a-zA-Z0-9]$');
    return new Promise((resolve, reject) => {
        if (!email) {
            reject(createError.BadRequest('Please enter email'));
        }
        else if (!validator.isEmail(email)) {
            reject(createError.BadRequest('Invalid email'));
        }
        if (!password) {
            reject(createError.BadRequest('Please enter password'));
        }
        if (!username) {
            reject(createError.BadRequest('Please enter username'));
        } else if (!regexUsername.test(username)) {
            reject(createError.BadRequest('Username must contain 5-10 alphanumeric characters, underscore and dot'));
        }

        resolve();
    })
}