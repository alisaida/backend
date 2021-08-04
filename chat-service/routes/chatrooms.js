import express from 'express';

import { isAuthenticated } from '../utils/jwt.js';
import {
    createChatroom,
    fetchChatroom,
    updateChatroom,
    fetchUserChatRooms,
    fetchChatRoomRecipients,
    createMessage,
    fetchChatRoomMessages
} from '../controllers/chatrooms.js';

const chatroomRoute = express.Router();

chatroomRoute.get('/', (req, res) => {
    res.status(200).send('Welcome');
})

chatroomRoute.get('/chatrooms/:id', isAuthenticated, fetchChatroom);
chatroomRoute.patch('/chatrooms/:id', isAuthenticated, updateChatroom);
chatroomRoute.post('/chatrooms/new', isAuthenticated, createChatroom); //push new chat data to rabbitmq

chatroomRoute.get('/chatrooms/:id/users', isAuthenticated, fetchChatRoomRecipients);
chatroomRoute.get('/users/:id/chatrooms', isAuthenticated, fetchUserChatRooms);

chatroomRoute.post('/messages/new', isAuthenticated, createMessage); //push new message data to rabbitmq
chatroomRoute.get('/chatrooms/:id/messages', isAuthenticated, fetchChatRoomMessages);

export default chatroomRoute;