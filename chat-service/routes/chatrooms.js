import express from 'express';

import ***REMOVED*** verifyAccessToken ***REMOVED*** from '../utils/jwt.js';
import ***REMOVED***
    createChatroom,
    fetchChatroom,
    updateChatroom,
    fetchUserChatRooms,
    fetchChatRoomRecipients,
    createMessage,
    fetchChatRoomMessages
***REMOVED*** from '../controllers/chatrooms.js';

const chatroomRoute = express.Router();

chatroomRoute.get('/', (req, res) => ***REMOVED***
    res.status(200).send('Welcome');
***REMOVED***)

chatroomRoute.get('/chatrooms/:id', verifyAccessToken, fetchChatroom);
chatroomRoute.patch('/chatrooms/:id', verifyAccessToken, updateChatroom);
chatroomRoute.post('/chatrooms/new', verifyAccessToken, createChatroom); //push new chat data to rabbitmq

chatroomRoute.get('/chatrooms/:id/users', verifyAccessToken, fetchChatRoomRecipients);
chatroomRoute.get('/users/:id/chatrooms', verifyAccessToken, fetchUserChatRooms);

chatroomRoute.post('/messages/new', verifyAccessToken, createMessage); //push new message data to rabbitmq
chatroomRoute.get('/chatrooms/:id/messages', verifyAccessToken, fetchChatRoomMessages);

export default chatroomRoute;