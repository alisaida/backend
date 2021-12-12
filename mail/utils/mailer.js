import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';


dotenv.config();
const EMAIL_ACCOUNT = process.env.EMAIL_ACCOUNT;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const sendMail = async (name, email, subject, uri, template) => ***REMOVED***
    try ***REMOVED***
        const transport = nodemailer.createTransport(***REMOVED***
            host: process.env.EMAIL_HOST,
            port: 465,
            secure: true,
            auth: ***REMOVED***
                user: EMAIL_ACCOUNT,
                pass: EMAIL_PASSWORD
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