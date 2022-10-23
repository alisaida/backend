import amqp from 'amqplib';
import mongoose from 'mongoose';

import User from '../models/users.js'

let amqpChannel;
amqp.connect(process.env.AMQP_URL).then(async (conn) => {
    amqpChannel = await conn.createChannel();
    await amqpChannel.assertQueue('USER');
    await amqpChannel.assertQueue('SIGN_UP');
    await amqpChannel.assertQueue('RESET_PASSWORD');
    await amqpChannel.assertQueue('UPDATE_USER_AUTH');
    console.log(`rabbitmq connection successful: ${process.env.AMQP_URL}`);

    amqpChannel.consume('UPDATE_USER_AUTH', message => {
        updateUserProfile(message);
    })
}).catch((error) => console.log(`${error} failed to connect to amqp`));

export const publishToQueue = async (queueName, data) => {
    amqpChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { persistent: true });
}

const updateUserProfile = async (message) => {
    const user = JSON.parse(message.content.toString());
    if (user) {
        console.log(`New asynchronous message received`);
        console.log('new data', user)

        const session = await mongoose.startSession();
        session.startTransaction();
        try {

            const { userId, username, name } = user;

            const doesExist = await User.findOne({ _id: userId });
            if (doesExist) {
                await User.findOneAndUpdate(
                    { _id: userId },
                    {
                        $set: {
                            name: name,
                            username: username,
                            updatedAt: new Date().toISOString()
                        }
                    }
                    , {
                        upsert: true
                    }
                );

                console.log(`persist event for update user profile data for _id: ${userId}`);

                amqpChannel.ack(message);
            }
        } catch (err) {
            console.log(`failed to persist event for update user profile data: ${err}`)
            await session.abortTransaction();
        }
    }
}