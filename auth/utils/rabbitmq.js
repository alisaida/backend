import amqp from 'amqplib';

let amqpChannel;
amqp.connect(process.env.AMQP_URL).then(async (conn) => {
    amqpChannel = await conn.createChannel();
    await amqpChannel.assertQueue('USER');
    await amqpChannel.assertQueue('SIGN_UP');
    await amqpChannel.assertQueue('RESET_PASSWORD');
    console.log(`rabbitmq connection successful: ${process.env.AMQP_URL}`);
}).catch((error) => console.log(`${error} failed to connect to amqp`));

export const publishToQueue = async (queueName, data) => {
    amqpChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { persistent: true });
}