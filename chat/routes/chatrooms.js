import express from 'express';

import ***REMOVED*** verifyAccessToken ***REMOVED*** from '../utils/jwt.js';
import ***REMOVED***
    createChatroom,
    fetchChatroom,
    updateChatroom,
    fetchUserChatRooms,
    fetchChatRoomRecipients,
    createMessage,
    createImageMessage,
    fetchChatRoomMessages,
    fetchChatRoomIdByUserId,
    me,
    home,
***REMOVED*** from '../controllers/chatrooms.js';

const chatroomRoute = express.Router();

chatroomRoute.get('/api/chats', home);
chatroomRoute.get('/api/chats/me', verifyAccessToken, me);
chatroomRoute.get('/api/chats/:id', verifyAccessToken, fetchChatroom);
chatroomRoute.patch('/api/chats/:id', verifyAccessToken, updateChatroom);
chatroomRoute.post('/api/chats/new', verifyAccessToken, createChatroom); //push new chat data to rabbitmq

chatroomRoute.get('/api/chats/:id/users', verifyAccessToken, fetchChatRoomRecipients);
chatroomRoute.get('/api/chats/users/:id/chatrooms', verifyAccessToken, fetchUserChatRooms);

chatroomRoute.post('/api/chats/:id/messages/new', verifyAccessToken, createMessage); //push new message data to rabbitmq
chatroomRoute.post('/api/chats/:id/messages/new', verifyAccessToken, createImageMessage);
chatroomRoute.get('/api/chats/:id/messages', verifyAccessToken, fetchChatRoomMessages);
chatroomRoute.get('/api/chats/users/:id/me/', verifyAccessToken, fetchChatRoomIdByUserId);

export default chatroomRoute;
