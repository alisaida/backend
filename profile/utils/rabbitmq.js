import amqp from 'amqplib';
import mongoose from 'mongoose';

import User from '../models/users.js';
import Profile from '../models/profiles.js';

let amqpChannel;

export const consumeUsersQueue = async () => {
    try {
        const conn = await amqp.connect(process.env.AMQP_URL);
        amqpChannel = await conn.createChannel();
        await amqpChannel.assertQueue('USER_PROFILE');
        console.log(`rabbitmq connection successful: ${process.env.AMQP_URL}`);

        amqpChannel.consume('USER_PROFILE', message => {
            saveUser(message);
        })
    } catch (err) {
        console.log(`${err} failed to connect to amqp`);
    }
}

export const publishToQueue = async (queueName, data) => {
    amqpChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { persistent: true });
}

const saveUser = async (message) => {
    const user = JSON.parse(message.content.toString());
    if (user) {
        console.log(`New asynchronous message received`);
        const session = await mongoose.startSession();
        session.startTransaction();
        try {

            const { userId, email, username, name } = user;

            const doesExist = await User.findOne({ email });
            if (!doesExist) {
                const userData = new User({ userId, email, username, name });
                const profileData = new Profile({ userId, username, name });

                await userData.save({ session });
                await profileData.save({ session });

                await session.commitTransaction();

                console.log(`persisted event data for _id: ${userId}`);

                amqpChannel.ack(message);
            }
        } catch (err) {
            console.log(`failed to persist user and profile data: ${err}`)
            await session.abortTransaction();
        }
    }

}