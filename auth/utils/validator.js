import createError from 'http-errors';
import validator from 'validator';

export const validateLogin = (email, password) => ***REMOVED***
    return new Promise((resolve, reject) => ***REMOVED***
        if (!email) ***REMOVED***
            reject(createError.BadRequest('Please enter email'));
        ***REMOVED***
        if (!validator.isEmail(email)) ***REMOVED***
            reject(createError.BadRequest('Invalid email'));
        ***REMOVED***
        if (!password) ***REMOVED***
            reject(createError.BadRequest('Please enter password'));
        ***REMOVED***
        resolve();
    ***REMOVED***)
***REMOVED***

export const validateRegister = (email, mobile, password) => ***REMOVED***
    return new Promise((resolve, reject) => ***REMOVED***
        if (!email) ***REMOVED***
            reject(createError.BadRequest('Please enter email'));
        ***REMOVED***
        if (!validator.isEmail(email)) ***REMOVED***
            reject(createError.BadRequest('Invalid email'));
        ***REMOVED***
        if (!password) ***REMOVED***
            reject(createError.BadRequest('Please enter password'));
        ***REMOVED***
        if (!password && !validator.isAlphanumeric(password)) ***REMOVED***
            reject(createError.BadRequest('Password requires minimum of 8 alphanumeric characters'))
        ***REMOVED***
        if (!validator.isMobilePhone(mobile)) ***REMOVED***
            reject(createError.BadRequest('Invalid mobile number'));
        ***REMOVED***

        resolve();
    ***REMOVED***)
***REMOVED***