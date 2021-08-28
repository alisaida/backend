import amqp from 'amqplib';
import mongoose from 'mongoose';

import User from '../models/users.js'

let amqpChannel;

export const consumeUsersQueue = async () => ***REMOVED***
    try ***REMOVED***
        const conn = await amqp.connect(process.env.AMQP_URL);
        amqpChannel = await conn.createChannel();
        await amqpChannel.assertQueue('USER_POST');
        console.log(`rabbitmq connection successful: $***REMOVED***process.env.AMQP_URL***REMOVED***`);

        amqpChannel.consume('USER_POST', message => ***REMOVED***
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

        const ***REMOVED*** userId, email, mobile, name ***REMOVED*** = user;

        const doesExist = await User.findOne(***REMOVED*** email ***REMOVED***);
        if (!doesExist) ***REMOVED***
            const userData = new User(***REMOVED*** userId, email, mobile, name ***REMOVED***);
            const savedUser = await userData.save();
            if (savedUser && savedUser._id) ***REMOVED***
                console.log(`persisted event data for _id: $***REMOVED***userId***REMOVED***`);
                amqpChannel.ack(message);
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***

***REMOVED***