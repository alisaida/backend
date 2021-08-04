import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { google } from 'googleapis';
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
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendMail = async (name, email, subject, uri, template) => {
    try {
        const accessToken = await oauth2Client.getAccessToken();
        const transport = nodemailer.createTransport({

            service: 'gmail',
            auth: {
                type: 'oauth2',
                user: EMAIL_ACCOUNT,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: EMAIL_ACCOUNT,
            to: email,
            subject: subject,
            html: template({ name: name, uri: uri })
        }

        transport.sendMail(mailOptions, (error, data) => {
            if (error) {
                console.log(`Error ${error}`);
            } else {
                console.log('Email sent successfully');
            }
        });

    } catch (err) {
        console.log(err)
    }
}

export const prepareAndSendEmail = async (data) => {
    const { name, email, subject, uri } = data;

    const templateName = subject === 'Welcome!' ? 'welcome.hbs' : 'password-reset.hbs';

    console.log('Preparing and sending email');
    const filePath = path.join(path.resolve('./templates'), templateName);
    const source = fs.readFileSync(filePath, 'utf8');

    const template = handlebars.compile(source, { encoding: 'utf8' });
    sendMail(name, email, subject, uri, template);
}