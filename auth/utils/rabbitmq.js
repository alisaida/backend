import amqp from 'amqplib';

let amqpChannel;
amqp.connect(process.env.AMQP_URL).then(async (conn) => ***REMOVED***
    amqpChannel = await conn.createChannel();
    await amqpChannel.assertQueue('USER');
    await amqpChannel.assertQueue('SIGN_UP');
    await amqpChannel.assertQueue('RESET_PASSWORD');
    console.log(`rabbitmq connection successful: $***REMOVED***process.env.AMQP_URL***REMOVED***`);
***REMOVED***).catch((error) => console.log(`$***REMOVED***error***REMOVED*** failed to connect to amqp`));

export const publishToQueue = async (queueName, data) => ***REMOVED***
    amqpChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), ***REMOVED*** persistent: true ***REMOVED***);
***REMOVED***