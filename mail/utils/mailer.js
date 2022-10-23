import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';


dotenv.config();
const EMAIL_ACCOUNT = process.env.EMAIL_ACCOUNT;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const sendMail = async (name, email, subject, uri, template) => {
    try {
        const transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: EMAIL_ACCOUNT,
                pass: EMAIL_PASSWORD
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