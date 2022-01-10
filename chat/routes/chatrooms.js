import express from 'express';

import { verifyAccessToken } from '../utils/jwt.js';
import { createChatroom, fetchChatroom, updateChatroom, fetchUserChatRooms, fetchChatRoomRecipients, createMessage, createImageMessage, createMessageCall, createMessagePost, fetchChatRoomMessages, fetchChatRoomLastMessage, fetchChatWithRecipient, home, } from '../controllers/chatrooms.js';

const chatroomRoute = express.Router();

chatroomRoute.get('/api/chats', home);
chatroomRoute.get('/api/chats/:id', verifyAccessToken, fetchChatroom);
chatroomRoute.patch('/api/chats/:id', verifyAccessToken, updateChatroom);
chatroomRoute.post('/api/chats/new', verifyAccessToken, createChatroom); //push new chat data to rabbitmq

chatroomRoute.get('/api/chats/:id/users', verifyAccessToken, fetchChatRoomRecipients);
chatroomRoute.get('/api/chats/users/:id/chatrooms', verifyAccessToken, fetchUserChatRooms);

chatroomRoute.post('/api/chats/:id/messages/newMessage', verifyAccessToken, createMessage);
chatroomRoute.post('/api/chats/:id/messages/newMessageImage', verifyAccessToken, createImageMessage);
chatroomRoute.post('/api/chats/:id/messages/newMessagePost', verifyAccessToken, createMessagePost);
chatroomRoute.post('/api/chats/:id/messages/newMessageCall', verifyAccessToken, createMessageCall);
chatroomRoute.get('/api/chats/:id/messages', verifyAccessToken, fetchChatRoomMessages);
chatroomRoute.get('/api/chats/:id/lastMessage', verifyAccessToken, fetchChatRoomLastMessage);
chatroomRoute.get('/api/chats/users/:id/me/', verifyAccessToken, fetchChatWithRecipient);

export default chatroomRoute;
