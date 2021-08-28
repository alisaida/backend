import amqp from 'amqplib';

import ***REMOVED*** prepareAndSendEmail ***REMOVED*** from './mailer.js'

let amqpChannel;

export const listenToEmailQueue = async () => ***REMOVED***
    try ***REMOVED***
        const conn = await amqp.connect(process.env.AMQP_URL);
        amqpChannel = await conn.createChannel();
        await amqpChannel.assertQueue('SIGN_UP');
        await amqpChannel.assertQueue('RESET_PASSWORD');
        console.log(`rabbitmq connection successful: $***REMOVED***process.env.AMQP_URL***REMOVED***`);

        amqpChannel.consume('SIGN_UP', message => ***REMOVED***
            prepareEmail(message);
        ***REMOVED***);

        amqpChannel.consume('RESET_PASSWORD', message => ***REMOVED***
            prepareEmail(message);
        ***REMOVED***);
    ***REMOVED*** catch (err) ***REMOVED***
        console.log(`$***REMOVED***err***REMOVED*** failed to connect to amqp`);
    ***REMOVED***
***REMOVED***

const prepareEmail = async (message) => ***REMOVED***
    const data = JSON.parse(message.content.toString());
    if (data) ***REMOVED***
        console.log(`New asynchronous message received`);
        prepareAndSendEmail(data);
        amqpChannel.ack(message);
    ***REMOVED***
***REMOVED***