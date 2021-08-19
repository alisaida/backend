import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import ***REMOVED*** google ***REMOVED*** from 'googleapis';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';


dotenv.config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const EMAIL_ACCOUNT = process.env.EMAIL_ACCOUNT;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
oauth2Client.setCredentials(***REMOVED*** refresh_token: REFRESH_TOKEN ***REMOVED***);

const sendMail = async (name, email, subject, uri, template) => ***REMOVED***
    try ***REMOVED***
        const accessToken = await oauth2Client.getAccessToken();
        const transport = nodemailer.createTransport(***REMOVED***

            service: 'gmail',
            auth: ***REMOVED***
                type: 'oauth2',
                user: EMAIL_ACCOUNT,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            ***REMOVED***
        ***REMOVED***)

        const mailOptions = ***REMOVED***
            from: EMAIL_ACCOUNT,
            to: email,
            subject: subject,
            html: template(***REMOVED*** name: name, uri: uri ***REMOVED***)
        ***REMOVED***

        transport.sendMail(mailOptions, (error, data) => ***REMOVED***
            if (error) ***REMOVED***
                console.log(`Error $***REMOVED***error***REMOVED***`);
            ***REMOVED*** else ***REMOVED***
                console.log('Email sent successfully');
            ***REMOVED***
        ***REMOVED***);

    ***REMOVED*** catch (err) ***REMOVED***
        console.log(err)
    ***REMOVED***
***REMOVED***

export const prepareAndSendEmail = async (data) => ***REMOVED***
    const ***REMOVED*** name, email, subject, uri ***REMOVED*** = data;

    const templateName = subject === 'Welcome!' ? 'welcome.hbs' : 'password-reset.hbs';

    console.log('Preparing and sending email');
    const filePath = path.join(path.resolve('./templates'), templateName);
    const source = fs.readFileSync(filePath, 'utf8');

    const template = handlebars.compile(source, ***REMOVED*** encoding: 'utf8' ***REMOVED***);
    sendMail(name, email, subject, uri, template);
***REMOVED***