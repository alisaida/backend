import express from 'express';

import ***REMOVED*** isAuthenticated ***REMOVED*** from '../utils/jwt.js';
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

chatroomRoute.get('/chatrooms/:id', isAuthenticated, fetchChatroom);
chatroomRoute.patch('/chatrooms/:id', isAuthenticated, updateChatroom);
chatroomRoute.post('/chatrooms/new', isAuthenticated, createChatroom); //push new chat data to rabbitmq

chatroomRoute.get('/chatrooms/:id/users', isAuthenticated, fetchChatRoomRecipients);
chatroomRoute.get('/users/:id/chatrooms', isAuthenticated, fetchUserChatRooms);

chatroomRoute.post('/messages/new', isAuthenticated, createMessage); //push new message data to rabbitmq
chatroomRoute.get('/chatrooms/:id/messages', isAuthenticated, fetchChatRoomMessages);

export default chatroomRoute;