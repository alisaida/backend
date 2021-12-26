import createHttpError from 'http-errors';
import mongoose from 'mongoose';

import ChatRoom from '../models/chatrooms.js'
import ChatRoomUser from '../models/chatroomsers.js';
import User from '../models/users.js'
import Message from '../models/messages.js'

/**
 * home
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const home = async (req, res, next) => {
    res.send('Welcome!');
}

/**
 * fetch entire chatroom data, recipients and messages
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const fetchChatroom = async (req, res, next) => {
    const chatRoomId = req.params.id;
    if (!chatRoomId) {
        throw createHttpError.BadRequest();
    }

    try {
        const chatRoomObj = await ChatRoom.findById({ _id: chatRoomId })
        if (!chatRoomObj) {
            throw createHttpError.NotFound();
        }

        const recipients = await getRecipientsHelperFn(chatRoomId);
        const messages = await fetchMessagesHelperFn(chatRoomId);
        const lastMessage = (messages && messages.length > 0) ? messages[messages.length - 1] : null;

        const chatRoom = {
            name: chatRoomObj.name || '',
            isGroupChat: chatRoomObj.isGroupChat,
            createdAt: chatRoomObj.createdAt,
            updatedAt: chatRoomObj.updatedAt || '',
            lastMessage: lastMessage,
            recipients: recipients,
            messages: messages
        }

        res.status(200).send(chatRoom);
    } catch (error) {
        next(error);
    }
}

/**
 * fetch all chatrooms where current authenticated user is recipient
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const me = async (req, res, next) => {

    try {
        const user = await User.findOne({ userId: req.authUser });
        let chatRooms = await fetchChatsByUserId(user.userId);

        const data = await Promise.all(chatRooms.map(async (chatRoom, index) => {
            const lastMessage = await fetchLastMessageInChatRoom(chatRoom._id);

            return {
                isGroupChat: chatRoom.isGroupChat,
                createdAt: chatRoom.createdAt,
                _id: chatRoom._id,
                lastMessage: lastMessage
            }
        }));

        if (data) {
            res.status(200).send({ chatRooms: data });
        } else {
            throw createHttpError.InternalServerError();
        }
    } catch (err) {
        next(err);
    }
}

const fetchLastMessageInChatRoom = async (chatRoomId) => {
    try {
        const lastList = await Message.find({ chatRoomId: chatRoomId }).sort({ _id: -1 }).limit(1).exec();

        if (lastList && lastList.length === 1) {
            return lastList[0];
        } else {
            return null
        }
    } catch (error) {
        return null
    }
}

/**
 * fetch all chatrooms where user is recipient
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const fetchChatRoomIdByUserId = async (req, res, next) => {
    try {

        const authUser = await User.findOne({ userId: req.authUser });
        let authChatRooms = [];
        authChatRooms = await fetchChatsByUserId(authUser.userId);

        const userId = req.params.id

        const doesExist = await User.findOne({ userId });

        if (!doesExist) {
            throw createHttpError.NotFound("User not found!");
        }

        let userChatRooms = [];
        userChatRooms = await fetchChatsByUserId(userId);

        //no chats between authUser and recipient
        if (!authChatRooms || authChatRooms.length === 0 || !userChatRooms || userChatRooms.length === 0) {
            throw createHttpError.NotFound("Chatroom not found!");
        }

        const chatsArray1 = authChatRooms.map(chatRooms => chatRooms._id.toString());
        const chatsArray2 = userChatRooms.map(chatRooms => chatRooms._id.toString());

        const filteredArray = chatsArray1.filter(chatRoom => chatsArray2.includes(chatRoom));

        if (filteredArray && filteredArray.length > 0) {
            res.status(200).send({ id: filteredArray[0] });
        } else {
            throw createHttpError.NotFound("Chatroom not found!");
        }
    } catch (err) {
        next(err);
    }
}

/**
 * fetch all chatrooms where user is recipient
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const fetchUserChatRooms = async (req, res, next) => {
    try {

        const userId = req.params.id

        const doesExist = await User.findOne({ userId });

        if (!doesExist) {
            throw createHttpError.NotFound("User not found!");
        }

        const chatRooms = await fetchChatsByUserId(userId);

        if (chatRooms) {
            res.status(200).send({ chatRooms });
        } else {
            throw createHttpError.InternalServerError();
        }
    } catch (err) {
        next(err);
    }


}

/**
 * fetch chatroom recipients
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const fetchChatRoomRecipients = async (req, res, next) => {
    const chatRoomId = req.params.id;
    if (!chatRoomId) {
        throw createHttpError.BadRequest();
    }

    try {
        const chatRoomObj = await ChatRoom.findById({ _id: chatRoomId })
        if (!chatRoomObj) {
            createHttpError.NotFound();
        }

        const recipients = await getRecipientsHelperFn(chatRoomId);
        const recipientsObj = {
            recipients
        }

        res.status(200).send(recipientsObj);
    } catch (error) {
        next(error);
    }
}

/**
 * creates a new chatoom entity
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const createChatroom = async (req, res, next) => {
    const { username } = req.body;

    if (!username) {
        throw createHttpError.BadRequest();
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const sender = await User.findOne({ userId: req.authUser });
        const recipient = await User.findOne({ username });

        if (!recipient) {
            throw createHttpError.InternalServerError();
        }

        const chatRoom = new ChatRoom();
        const savedChatRoom = await chatRoom.save({ session });

        // link users to chatrooms
        await ChatRoomUser.create([{
            userId: sender.userId,
            chatRoomId: savedChatRoom._id
        }, {
            userId: recipient.userId,
            chatRoomId: savedChatRoom._id
        }], { session });

        await session.commitTransaction();
        console.log(`New chatroom ${savedChatRoom._id} created between ${sender.userId} and ${recipient.userId}`)

        res.status(201).send(savedChatRoom);
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
}

/**
 * update chatroom and links recipient to chatroom if included in the request payload
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const updateChatroom = async (req, res, next) => {
    const chatRoomId = req.params.id;
    if (!chatRoomId) {
        throw createHttpError.BadRequest();
    }

    const { name, isGroupChat, recipient } = req.body;

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        //update document by payload
        await ChatRoom.findOneAndUpdate(
            { _id: chatRoomId }, {
            $set: {
                name: name,
                isGroupChat: isGroupChat,
                updatedAt: new Date().toISOString()
            }
        },
            { upsert: true }
        );

        // link any new contacts in the payload to the chatroom
        if (recipient) {
            const doesExist = await User.findOne({ userId: recipient });
            if (!doesExist) {
                throw createHttpError.BadRequest('Recipient not found');
            }

            await ChatRoomUser.create([{
                userId: recipient,
                chatRoomId: chatRoomId
            }], { session });
            console.log(`Adding recipient: ${recipient} to chatroom ${chatRoomId} `)
        }
        await session.commitTransaction();
        res.status(200).send('ChatRoom updated sucesfully');
    } catch (error) {
        await session.abortTransaction();
        next(error)
    } finally {
        session.endSession();
    }
}

/**
 * reusable helper function to return chatroom recipients
 * @param {*} chatRoomId
 * @returns
 */
const getRecipientsHelperFn = async (chatRoomId) => {
    if (!chatRoomId) {
        createHttpError.BadRequest();
    }

    const chatRoomUsers = await ChatRoomUser.find({ chatRoomId: chatRoomId });

    //impossible for chatroom to exist without recipients
    if (!chatRoomUsers || chatRoomUsers.length === 0) {
        createHttpError.InternalServerError('No chatroom recipients found!');
    }

    //recipient array
    const users = chatRoomUsers.map(chatRoomUser => chatRoomUser.userId);
    const recipientArray = await User.find({ userId: { $in: users } });
    const recipients = recipientArray.map(user => {
        return {
            userId: user.userId,
            name: user.name,
            username: user.username,
        }
    })

    return recipients;
}

export const createMessage = async (req, res, next) => {
    const chatRoomId = req.params.id;

    const { content } = req.body;
    const userId = req.authUser;

    const session = await mongoose.startSession();

    try {
        if (!chatRoomId) {
            throw createHttpError.BadRequest();
        }
        if (!content && !imageUri) {
            throw createHttpError.BadRequest('Payload missing content');
        }
        session.startTransaction();

        const doesExist = await ChatRoom.findOne({ _id: chatRoomId });

        if (!doesExist) {
            throw createHttpError.NotFound('Chatroom does not exist');
        }

        const message = new Message({
            chatRoomId: chatRoomId,
            userId: userId,
            content: content,
            createdAt: new Date().toISOString()
        });

        await message.save({ session });

        await session.commitTransaction();

        res.status(201).send(message);

    } catch (error) {
        session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
}

export const createImageMessage = async (req, res, next) => {
    const chatRoomId = req.params.id;

    const { imageUri } = req.body;
    const userId = req.authUser;

    const session = await mongoose.startSession();

    try {
        if (!chatRoomId) {
            throw createHttpError.BadRequest();
        }
        if (!imageUri) {
            throw createHttpError.BadRequest('Payload missing imageUri');
        }
        session.startTransaction();

        const doesExist = await ChatRoom.findOne({ _id: chatRoomId });

        if (!doesExist) {
            throw createHttpError.NotFound('Chatroom does not exist');
        }

        const message = new Message({
            chatRoomId: chatRoomId,
            userId: userId,
            imageUri: imageUri,
            createdAt: new Date().toISOString()
        });

        await message.save({ session });

        await session.commitTransaction();

        res.status(201).send(message);

    } catch (error) {
        session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
}

/**
 * retreive chat messages
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const fetchChatRoomMessages = async (req, res, next) => {

    const chatRoomId = req.params.id;
    try {
        const doesExist = await ChatRoom.findOne({ _id: chatRoomId });
        if (!doesExist) {
            throw createHttpError.NotFound('ChatRoom does not exist');
        }

        const messages = await fetchMessagesHelperFn(chatRoomId);

        res.status(200).send(messages);
    } catch (error) {
        next(error);
    }
}

const fetchMessagesHelperFn = async (chatRoomId) => {
    try {
        const messages = await Message.find({ chatRoomId: chatRoomId });

        return messages;
    } catch (error) {
        next(error);
    }
}

/**
 * reusable helper function to retrieve chat rooms by userId
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const fetchChatsByUserId = async (userId) => {
    try {
        const doesExist = await User.findOne({ userId });

        if (!doesExist) {
            throw createHttpError.NotFound();
        }

        const chatRoomsArray = await ChatRoomUser.find({ userId: userId });

        //if user isnt part of any chatrooms
        if (!chatRoomsArray || chatRoomsArray.length === 0) {
            res.status(200).send([]);
        }

        //otherwise link ChatRoomUsers back to chatrooms data
        const chatRoomIds = chatRoomsArray.map(chatRoomUser => {
            return {
                _id: chatRoomUser.chatRoomId
            }
        });
        const chatRooms = await ChatRoom.find({ _id: { $in: chatRoomIds } });

        return chatRooms;
    } catch (error) {
        return null;
    }
}
