import amqp from 'amqplib';
import mongoose from 'mongoose';

import User from '../models/users.js'

let amqpChannel;
amqp.connect(process.env.AMQP_URL).then(async (conn) => ***REMOVED***
    amqpChannel = await conn.createChannel();
    await amqpChannel.assertQueue('USER');
    await amqpChannel.assertQueue('SIGN_UP');
    await amqpChannel.assertQueue('RESET_PASSWORD');
    await amqpChannel.assertQueue('UPDATE_USER_AUTH');
    console.log(`rabbitmq connection successful: $***REMOVED***process.env.AMQP_URL***REMOVED***`);

    amqpChannel.consume('UPDATE_USER_AUTH', message => ***REMOVED***
        updateUserProfile(message);
    ***REMOVED***)
***REMOVED***).catch((error) => console.log(`$***REMOVED***error***REMOVED*** failed to connect to amqp`));

export const publishToQueue = async (queueName, data) => ***REMOVED***
    amqpChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), ***REMOVED*** persistent: true ***REMOVED***);
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

            const doesExist = await User.findOne(***REMOVED*** _id: userId ***REMOVED***);
            if (doesExist) ***REMOVED***
                await User.findOneAndUpdate(
                    ***REMOVED*** _id: userId ***REMOVED***,
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