import amqp from 'amqplib';
import mongoose from 'mongoose';

import User from '../models/users.js'

let amqpChannel;

export const consumeUsersQueue = async () => ***REMOVED***
    try ***REMOVED***
        const conn = await amqp.connect(process.env.AMQP_URL);
        amqpChannel = await conn.createChannel();
        await amqpChannel.assertQueue('USER_CHAT');
        await amqpChannel.assertQueue('UPDATE_USER_CHAT');
        console.log(`rabbitmq connection successful: $***REMOVED***process.env.AMQP_URL***REMOVED***`);

        amqpChannel.consume('USER_CHAT', message => ***REMOVED***
            saveUser(message);
        ***REMOVED***)

        amqpChannel.consume('UPDATE_USER_CHAT', message => ***REMOVED***
            updateUserProfile(message);
        ***REMOVED***)
    ***REMOVED*** catch (err) ***REMOVED***
        console.log(`$***REMOVED***err***REMOVED*** failed to connect to amqp`);
    ***REMOVED***
***REMOVED***

const saveUser = async (message) => ***REMOVED***
    const user = JSON.parse(message.content.toString());
    if (user) ***REMOVED***
        console.log(`New asynchronous message received`);

        const ***REMOVED*** userId, email, username, name ***REMOVED*** = user;

        const doesExist = await User.findOne(***REMOVED*** email ***REMOVED***);
        if (!doesExist) ***REMOVED***
            const userData = new User(***REMOVED*** userId, email, username, name ***REMOVED***);
            const savedUser = await userData.save();
            if (savedUser && savedUser._id) ***REMOVED***
                console.log(`persisted event data for _id: $***REMOVED***userId***REMOVED***`);
                amqpChannel.ack(message);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***

***REMOVED***

const updateUserProfile = async (message) => ***REMOVED***
    const user = JSON.parse(message.content.toString());
    if (user) ***REMOVED***
        console.log(`New asynchronous message received`);
        console.log('new data', user)

        const session = await mongoose.startSession();
        session.startTransaction();
        try ***REMOVED***

            const ***REMOVED*** userId, username, name ***REMOVED*** = user;

            const doesExist = await User.findOne(***REMOVED*** userId: userId ***REMOVED***);
            if (doesExist) ***REMOVED***
                await User.findOneAndUpdate(
                    ***REMOVED*** userId: userId ***REMOVED***,
                    ***REMOVED***
                        $set: ***REMOVED***
                            name: name,
                            username: username,
                            updatedAt: new Date().toISOString()
                        ***REMOVED***
                    ***REMOVED***
                    , ***REMOVED***
                        upsert: true
                    ***REMOVED***
                );

                console.log(`persist event for update user profile data for _id: $***REMOVED***userId***REMOVED***`);

                amqpChannel.ack(message);
            ***REMOVED***
        ***REMOVED*** catch (err) ***REMOVED***
            console.log(`failed to persist event for update user profile data: $***REMOVED***err***REMOVED***`)
            await session.abortTransaction();
        ***REMOVED***
    ***REMOVED***
***REMOVED***