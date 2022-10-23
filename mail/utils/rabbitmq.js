import amqp from 'amqplib';

import { prepareAndSendEmail } from './mailer.js'

let amqpChannel;

export const listenToEmailQueue = async () => {
    try {
        const conn = await amqp.connect(process.env.AMQP_URL);
        amqpChannel = await conn.createChannel();
        await amqpChannel.assertQueue('SIGN_UP');
        await amqpChannel.assertQueue('RESET_PASSWORD');
        console.log(`rabbitmq connection successful: ${process.env.AMQP_URL}`);

        amqpChannel.consume('SIGN_UP', message => {
            prepareEmail(message);
        });

        amqpChannel.consume('RESET_PASSWORD', message => {
            prepareEmail(message);
        });
    } catch (err) {
        console.log(`${err} failed to connect to amqp`);
    }
}

const prepareEmail = async (message) => {
    const data = JSON.parse(message.content.toString());
    if (data) {
        console.log(`New asynchronous message received`);
        prepareAndSendEmail(data);
        amqpChannel.ack(message);
    }
}