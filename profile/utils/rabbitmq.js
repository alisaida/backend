import amqp from 'amqplib';
import mongoose from 'mongoose';

import User from '../models/users.js';
import Profile from '../models/profiles.js';

let amqpChannel;

export const consumeUsersQueue = async () => ***REMOVED***
    try ***REMOVED***
        const conn = await amqp.connect(process.env.AMQP_URL);
        amqpChannel = await conn.createChannel();
        await amqpChannel.assertQueue('USER_PROFILE');
        console.log(`rabbitmq connection successful: $***REMOVED***process.env.AMQP_URL***REMOVED***`);

        amqpChannel.consume('USER_PROFILE', message => ***REMOVED***
            saveUser(message);
        ***REMOVED***)
    ***REMOVED*** catch (err) ***REMOVED***
        console.log(`$***REMOVED***err***REMOVED*** failed to connect to amqp`);
    ***REMOVED***
***REMOVED***

const saveUser = async (message) => ***REMOVED***
    const user = JSON.parse(message.content.toString());
    if (user) ***REMOVED***
        console.log(`New asynchronous message received`);
        const session = await mongoose.startSession();
        session.startTransaction();
        try ***REMOVED***

            const ***REMOVED*** userId, email, username, name ***REMOVED*** = user;

            const doesExist = await User.findOne(***REMOVED*** email ***REMOVED***);
            if (!doesExist) ***REMOVED***
                const userData = new User(***REMOVED*** userId, email, username, name ***REMOVED***);
                const profileData = new Profile(***REMOVED*** userId, username, name ***REMOVED***);

                await userData.save(***REMOVED*** session ***REMOVED***);
                await profileData.save(***REMOVED*** session ***REMOVED***);

                await session.commitTransaction();

                console.log(`persisted event data for _id: $***REMOVED***userId***REMOVED***`);

                amqpChannel.ack(message);
            ***REMOVED***
        ***REMOVED*** catch (err) ***REMOVED***
            console.log(`failed to persist user and profile data: $***REMOVED***err***REMOVED***`)
            await session.abortTransaction();
        ***REMOVED***
    ***REMOVED***

***REMOVED***