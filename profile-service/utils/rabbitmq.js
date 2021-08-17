import amqp from 'amqplib';
import mongoose from 'mongoose';

import User from '../models/users.js'

let amqpChannel;

export const consumeUsersQueue = async () => {
    try {
        const conn = await amqp.connect(process.env.AMQP_URL);
        amqpChannel = await conn.createChannel();
        await amqpChannel.assertQueue('USER');
        console.log(`rabbitmq connection successful: ${process.env.AMQP_URL}`);

        amqpChannel.consume('USER', message => {
            saveUser(message);
        })

        process.on('beforeExit', () => {
            console.log('Closing amqp connection')
        })

    } catch (err) {
        console.log(`${err} failed to connect to database`)
    }
}

const saveUser = async (message) => {
    const user = JSON.parse(message.content.toString());
    if (user) {
        console.log(`New user event data`);

        const { userId, email, mobile, name } = user;

        const doesExist = await User.findOne({ email });
        if (!doesExist) {
            const userData = new User({ userId, email, mobile, name });
            const savedUser = await userData.save();
            if (savedUser && savedUser._id) {
                console.log(`persisted event data for _id: ${userId}`);
                amqpChannel.ack(message);
            }
        }
    }

}