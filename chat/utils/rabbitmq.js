import amqp from 'amqplib';
import mongoose from 'mongoose';

import User from '../models/users.js'

let amqpChannel;

export const consumeUsersQueue = async () => {
    try {
        const conn = await amqp.connect(process.env.AMQP_URL);
        amqpChannel = await conn.createChannel();
        await amqpChannel.assertQueue('USER_CHAT');
        await amqpChannel.assertQueue('UPDATE_USER_CHAT');
        console.log(`rabbitmq connection successful: ${process.env.AMQP_URL}`);

        amqpChannel.consume('USER_CHAT', message => {
            saveUser(message);
        })

        amqpChannel.consume('UPDATE_USER_CHAT', message => {
            updateUserProfile(message);
        })
    } catch (err) {
        console.log(`${err} failed to connect to amqp`);
    }
}

const saveUser = async (message) => {
    const user = JSON.parse(message.content.toString());
    if (user) {
        console.log(`New asynchronous message received`);

        const { userId, email, username, name } = user;

        const doesExist = await User.findOne({ email });
        if (!doesExist) {
            const userData = new User({ userId, email, username, name });
            const savedUser = await userData.save();
            if (savedUser && savedUser._id) {
                console.log(`persisted event data for _id: ${userId}`);
                amqpChannel.ack(message);
            }
        }
    }

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

            const doesExist = await User.findOne({ userId: userId });
            if (doesExist) {
                await User.findOneAndUpdate(
                    { userId: userId },
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