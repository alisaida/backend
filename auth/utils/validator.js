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

export const validateRegister = (email, username, password) => ***REMOVED***
    //regex to validate: alphanumeric _ (underscores) and . (dots) using negative look ahead
    const regexUsername = new RegExp('^[a-zA-Z0-9](_(?!(\.|_))|\.(?![_.])|[a-zA-Z0-9])***REMOVED***3,8***REMOVED***[a-zA-Z0-9]$');
    return new Promise((resolve, reject) => ***REMOVED***
        if (!email) ***REMOVED***
            reject(createError.BadRequest('Please enter email'));
        ***REMOVED***
        else if (!validator.isEmail(email)) ***REMOVED***
            reject(createError.BadRequest('Invalid email'));
        ***REMOVED***
        if (!password) ***REMOVED***
            reject(createError.BadRequest('Please enter password'));
        ***REMOVED***
        if (!username) ***REMOVED***
            reject(createError.BadRequest('Please enter username'));
        ***REMOVED*** else if (!regexUsername.test(username)) ***REMOVED***
            reject(createError.BadRequest('Username must contain 5-10 alphanumeric characters, underscore and dot'));
        ***REMOVED***

        resolve();
    ***REMOVED***)
***REMOVED***