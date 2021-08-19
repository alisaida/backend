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

export const validateRegister = (email, mobile, password) => {
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
        if (!password && !validator.isAlphanumeric(password)) {
            reject(createError.BadRequest('Password requires minimum of 8 alphanumeric characters'))
        }
        if (!validator.isMobilePhone(mobile)) {
            reject(createError.BadRequest('Invalid mobile number'));
        }

        resolve();
    })
}