import createHttpError from 'http-errors';
import mongoose from 'mongoose';

import ChatRoom from '../models/chatrooms.js'
import ChatRoomUser from '../models/chatroomsers.js';
import User from '../models/users.js'
import Message from '../models/messages.js'

/**
 * home
 * @param ***REMOVED*******REMOVED*** req
 * @param ***REMOVED*******REMOVED*** res
 * @param ***REMOVED*******REMOVED*** next
 */
export const home = async (req, res, next) => ***REMOVED***
    res.send('Welcome!');
***REMOVED***

/**
 * fetch chatroom data, recipients and last message
 * @param ***REMOVED*******REMOVED*** req
 * @param ***REMOVED*******REMOVED*** res
 * @param ***REMOVED*******REMOVED*** next
 */
export const fetchChatroom = async (req, res, next) => ***REMOVED***
    const chatRoomId = req.params.id;
    if (!chatRoomId) ***REMOVED***
        throw createHttpError.BadRequest();
    ***REMOVED***

    try ***REMOVED***
        const chatRoomObj = await ChatRoom.findById(***REMOVED*** _id: chatRoomId ***REMOVED***)
        if (!chatRoomObj) ***REMOVED***
            throw createHttpError.NotFound();
        ***REMOVED***

        const recipients = await getRecipientsHelperFn(chatRoomId);

        const lastList = await Message.find(***REMOVED*** chatRoomId: chatRoomId ***REMOVED***).sort(***REMOVED*** createdAt: -1 ***REMOVED***).limit(1).exec();
        const lastMessage = (lastList && lastList.length === 1) ? lastList[0] : null;

        const chatRoom = ***REMOVED***
            chatRoomId: chatRoomObj._id,
            name: chatRoomObj.name || '',
            isGroupChat: chatRoomObj.isGroupChat,
            createdAt: chatRoomObj.createdAt,
            updatedAt: chatRoomObj.updatedAt || '',
            lastMessage: lastMessage,
            recipients: recipients
        ***REMOVED***

        res.status(200).send(chatRoom);
    ***REMOVED*** catch (error) ***REMOVED***
        next(error);
    ***REMOVED***
***REMOVED***

/**
 * fetch chatroom between me is recipient userId
 * @param ***REMOVED*******REMOVED*** req
 * @param ***REMOVED*******REMOVED*** res
 * @param ***REMOVED*******REMOVED*** next
 */
export const fetchChatWithRecipient = async (req, res, next) => ***REMOVED***
    try ***REMOVED***

        const authUser = await User.findOne(***REMOVED*** userId: req.authUser ***REMOVED***);
        let authChatRooms = [];
        authChatRooms = await fetchChatsByUserId(authUser.userId);

        const userId = req.params.id

        const doesExist = await User.findOne(***REMOVED*** userId ***REMOVED***);

        if (!doesExist) ***REMOVED***
            throw createHttpError.NotFound("User not found!");
        ***REMOVED***

        let userChatRooms = [];
        userChatRooms = await fetchChatsByUserId(userId);

        //no chats between authUser and recipient
        if (!authChatRooms || authChatRooms.length === 0 || !userChatRooms || userChatRooms.length === 0) ***REMOVED***
            throw createHttpError.NotFound("Chatroom not found!");
        ***REMOVED***

        const chatsArray1 = authChatRooms.map(chatRooms => chatRooms._id.toString());
        const chatsArray2 = userChatRooms.map(chatRooms => chatRooms._id.toString());

        const filteredArray = chatsArray1.filter(chatRoom => chatsArray2.includes(chatRoom));

        if (filteredArray && filteredArray.length > 0) ***REMOVED***
            res.status(200).send(***REMOVED*** id: filteredArray[0] ***REMOVED***);
        ***REMOVED*** else ***REMOVED***
            throw createHttpError.NotFound("Chatroom not found!");
        ***REMOVED***
    ***REMOVED*** catch (err) ***REMOVED***
        next(err);
    ***REMOVED***
***REMOVED***

/**
 * fetch all chatrooms where user is recipient
 * @param ***REMOVED*******REMOVED*** req
 * @param ***REMOVED*******REMOVED*** res
 * @param ***REMOVED*******REMOVED*** next
 */
export const fetchUserChatRooms = async (req, res, next) => ***REMOVED***
    try ***REMOVED***

        const userId = req.params.id

        const doesExist = await User.findOne(***REMOVED*** userId ***REMOVED***);

        if (!doesExist) ***REMOVED***
            throw createHttpError.NotFound("User not found!");
        ***REMOVED***

        const chatRooms = await fetchChatsByUserId(userId);

        if (chatRooms) ***REMOVED***
            res.status(200).send(***REMOVED*** chatRooms ***REMOVED***);
        ***REMOVED*** else ***REMOVED***
            throw createHttpError.InternalServerError();
        ***REMOVED***
    ***REMOVED*** catch (err) ***REMOVED***
        next(err);
    ***REMOVED***
***REMOVED***

/**
 * fetch chatroom recipients
 * @param ***REMOVED*******REMOVED*** req
 * @param ***REMOVED*******REMOVED*** res
 * @param ***REMOVED*******REMOVED*** next
 */
export const fetchChatRoomRecipients = async (req, res, next) => ***REMOVED***
    const chatRoomId = req.params.id;
    if (!chatRoomId) ***REMOVED***
        throw createHttpError.BadRequest();
    ***REMOVED***

    try ***REMOVED***
        const chatRoomObj = await ChatRoom.findById(***REMOVED*** _id: chatRoomId ***REMOVED***)
        if (!chatRoomObj) ***REMOVED***
            createHttpError.NotFound();
        ***REMOVED***

        const recipients = await getRecipientsHelperFn(chatRoomId);
        const recipientsObj = ***REMOVED***
            recipients
        ***REMOVED***

        res.status(200).send(recipientsObj);
    ***REMOVED*** catch (error) ***REMOVED***
        next(error);
    ***REMOVED***
***REMOVED***

/**
 * creates a new chatoom entity
 * @param ***REMOVED*******REMOVED*** req
 * @param ***REMOVED*******REMOVED*** res
 * @param ***REMOVED*******REMOVED*** next
 */
export const createChatroom = async (req, res, next) => ***REMOVED***
    const ***REMOVED*** username ***REMOVED*** = req.body;

    if (!username) ***REMOVED***
        throw createHttpError.BadRequest();
    ***REMOVED***

    const session = await mongoose.startSession();

    try ***REMOVED***
        session.startTransaction();

        const sender = await User.findOne(***REMOVED*** userId: req.authUser ***REMOVED***);
        const recipient = await User.findOne(***REMOVED*** username ***REMOVED***);

        if (!recipient) ***REMOVED***
            throw createHttpError.InternalServerError();
        ***REMOVED***

        const chatRoom = new ChatRoom();
        const savedChatRoom = await chatRoom.save(***REMOVED*** session ***REMOVED***);

        // link users to chatrooms
        await ChatRoomUser.create([***REMOVED***
            userId: sender.userId,
            chatRoomId: savedChatRoom._id
        ***REMOVED***, ***REMOVED***
            userId: recipient.userId,
            chatRoomId: savedChatRoom._id
        ***REMOVED***], ***REMOVED*** session ***REMOVED***);

        await session.commitTransaction();
        console.log(`New chatroom $***REMOVED***savedChatRoom._id***REMOVED*** created between $***REMOVED***sender.userId***REMOVED*** and $***REMOVED***recipient.userId***REMOVED***`)

        res.status(201).send(savedChatRoom);
    ***REMOVED*** catch (error) ***REMOVED***
        await session.abortTransaction();
        next(error);
    ***REMOVED*** finally ***REMOVED***
        session.endSession();
    ***REMOVED***
***REMOVED***

/**
 * update chatroom and links recipient to chatroom if included in the request payload
 * @param ***REMOVED*******REMOVED*** req
 * @param ***REMOVED*******REMOVED*** res
 * @param ***REMOVED*******REMOVED*** next
 */
export const updateChatroom = async (req, res, next) => ***REMOVED***
    const chatRoomId = req.params.id;
    if (!chatRoomId) ***REMOVED***
        throw createHttpError.BadRequest();
    ***REMOVED***

    const ***REMOVED*** name, isGroupChat, recipient ***REMOVED*** = req.body;

    const session = await mongoose.startSession();
    try ***REMOVED***
        session.startTransaction();

        //update document by payload
        await ChatRoom.findOneAndUpdate(
            ***REMOVED*** _id: chatRoomId ***REMOVED***, ***REMOVED***
            $set: ***REMOVED***
                name: name,
                isGroupChat: isGroupChat,
                updatedAt: new Date().toISOString()
            ***REMOVED***
        ***REMOVED***,
            ***REMOVED*** upsert: true ***REMOVED***
        );

        // link any new contacts in the payload to the chatroom
        if (recipient) ***REMOVED***
            const doesExist = await User.findOne(***REMOVED*** userId: recipient ***REMOVED***);
            if (!doesExist) ***REMOVED***
                throw createHttpError.BadRequest('Recipient not found');
            ***REMOVED***

            await ChatRoomUser.create([***REMOVED***
                userId: recipient,
                chatRoomId: chatRoomId
            ***REMOVED***], ***REMOVED*** session ***REMOVED***);
            console.log(`Adding recipient: $***REMOVED***recipient***REMOVED*** to chatroom $***REMOVED***chatRoomId***REMOVED*** `)
        ***REMOVED***
        await session.commitTransaction();
        res.status(200).send('ChatRoom updated sucesfully');
    ***REMOVED*** catch (error) ***REMOVED***
        await session.abortTransaction();
        next(error)
    ***REMOVED*** finally ***REMOVED***
        session.endSession();
    ***REMOVED***
***REMOVED***

/**
 * reusable helper function to return chatroom recipients
 * @param ***REMOVED*******REMOVED*** chatRoomId
 * @returns
 */
const getRecipientsHelperFn = async (chatRoomId) => ***REMOVED***
    if (!chatRoomId) ***REMOVED***
        createHttpError.BadRequest();
    ***REMOVED***

    const chatRoomUsers = await ChatRoomUser.find(***REMOVED*** chatRoomId: chatRoomId ***REMOVED***);

    //impossible for chatroom to exist without recipients
    if (!chatRoomUsers || chatRoomUsers.length === 0) ***REMOVED***
        createHttpError.InternalServerError('No chatroom recipients found!');
    ***REMOVED***

    //recipient array
    const users = chatRoomUsers.map(chatRoomUser => chatRoomUser.userId);
    const recipientArray = await User.find(***REMOVED*** userId: ***REMOVED*** $in: users ***REMOVED*** ***REMOVED***);
    const recipients = recipientArray.map(user => ***REMOVED***
        return ***REMOVED***
            userId: user.userId,
            name: user.name,
            username: user.username,
        ***REMOVED***
    ***REMOVED***)

    return recipients;
***REMOVED***

export const createMessage = async (req, res, next) => ***REMOVED***
    const chatRoomId = req.params.id;

    const ***REMOVED*** content ***REMOVED*** = req.body;
    const userId = req.authUser;

    const session = await mongoose.startSession();

    try ***REMOVED***
        if (!chatRoomId) ***REMOVED***
            throw createHttpError.BadRequest();
        ***REMOVED***
        if (!content && !imageUri) ***REMOVED***
            throw createHttpError.BadRequest('Payload missing content');
        ***REMOVED***
        session.startTransaction();

        const doesExist = await ChatRoom.findOne(***REMOVED*** _id: chatRoomId ***REMOVED***);

        if (!doesExist) ***REMOVED***
            throw createHttpError.NotFound('Chatroom does not exist');
        ***REMOVED***

        const message = new Message(***REMOVED***
            chatRoomId: chatRoomId,
            userId: userId,
            content: content,
            createdAt: new Date().toISOString()
        ***REMOVED***);

        await message.save(***REMOVED*** session ***REMOVED***);

        await session.commitTransaction();

        res.status(201).send(message);

    ***REMOVED*** catch (error) ***REMOVED***
        session.abortTransaction();
        next(error);
    ***REMOVED*** finally ***REMOVED***
        session.endSession();
    ***REMOVED***
***REMOVED***

export const createImageMessage = async (req, res, next) => ***REMOVED***
    const chatRoomId = req.params.id;

    const ***REMOVED*** imageUri ***REMOVED*** = req.body;
    const userId = req.authUser;

    const session = await mongoose.startSession();

    try ***REMOVED***
        if (!chatRoomId) ***REMOVED***
            throw createHttpError.BadRequest();
        ***REMOVED***
        if (!imageUri) ***REMOVED***
            throw createHttpError.BadRequest('Payload missing imageUri');
        ***REMOVED***
        session.startTransaction();

        const doesExist = await ChatRoom.findOne(***REMOVED*** _id: chatRoomId ***REMOVED***);

        if (!doesExist) ***REMOVED***
            throw createHttpError.NotFound('Chatroom does not exist');
        ***REMOVED***

        const message = new Message(***REMOVED***
            chatRoomId: chatRoomId,
            userId: userId,
            imageUri: imageUri,
            createdAt: new Date().toISOString()
        ***REMOVED***);

        await message.save(***REMOVED*** session ***REMOVED***);

        await session.commitTransaction();

        res.status(201).send(message);

    ***REMOVED*** catch (error) ***REMOVED***
        session.abortTransaction();
        next(error);
    ***REMOVED*** finally ***REMOVED***
        session.endSession();
    ***REMOVED***
***REMOVED***

/**
 * retreive chat messages
 * @param ***REMOVED*******REMOVED*** req
 * @param ***REMOVED*******REMOVED*** res
 * @param ***REMOVED*******REMOVED*** next
 */
export const fetchChatRoomMessages = async (req, res, next) => ***REMOVED***
    try ***REMOVED***

        const chatRoomId = req.params.id;
        let ***REMOVED*** page, size ***REMOVED*** = req.query;

        if (!page) ***REMOVED***
            page = 1;
        ***REMOVED***

        if (!size) ***REMOVED***
            size = 10;
        ***REMOVED***

        const limit = parseInt(size);
        let options = ***REMOVED***
            sort: ***REMOVED*** createdAt: -1 ***REMOVED***,
            lean: true,
            page: page,
            limit: limit,
        ***REMOVED***;

        const doesExist = await ChatRoom.findOne(***REMOVED*** _id: chatRoomId ***REMOVED***);
        if (!doesExist) ***REMOVED***
            throw createHttpError.NotFound('ChatRoom does not exist');
        ***REMOVED***

        const data = await Message.paginate(***REMOVED*** chatRoomId: chatRoomId ***REMOVED***, options);
        const ***REMOVED*** docs, hasNextPage, nextPage, totalDocs ***REMOVED*** = data;

        const results = ***REMOVED***
            page,
            hasNextPage,
            nextPage,
            size,
            totalDocs,
            data: docs
        ***REMOVED***

        res.status(200).send(results);

    ***REMOVED*** catch (error) ***REMOVED***
        next(error);
    ***REMOVED***
***REMOVED***

/**
 * reusable helper function to retrieve chat rooms by userId
 * @param ***REMOVED*******REMOVED*** req
 * @param ***REMOVED*******REMOVED*** res
 * @param ***REMOVED*******REMOVED*** next
 */
export const fetchChatsByUserId = async (userId) => ***REMOVED***
    try ***REMOVED***
        const doesExist = await User.findOne(***REMOVED*** userId ***REMOVED***);

        if (!doesExist) ***REMOVED***
            throw createHttpError.NotFound();
        ***REMOVED***

        const chatRoomsArray = await ChatRoomUser.find(***REMOVED*** userId: userId ***REMOVED***);

        //if user isnt part of any chatrooms
        if (!chatRoomsArray || chatRoomsArray.length === 0) ***REMOVED***
            res.status(200).send([]);
        ***REMOVED***

        //otherwise link ChatRoomUsers back to chatrooms data
        const chatRoomIds = chatRoomsArray.map(chatRoomUser => ***REMOVED***
            return ***REMOVED***
                _id: chatRoomUser.chatRoomId
            ***REMOVED***
        ***REMOVED***);
        const chatRooms = await ChatRoom.find(***REMOVED*** _id: ***REMOVED*** $in: chatRoomIds ***REMOVED*** ***REMOVED***);

        return chatRooms;
    ***REMOVED*** catch (error) ***REMOVED***
        return null;
    ***REMOVED***
***REMOVED***
