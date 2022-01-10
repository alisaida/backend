const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');
const ***REMOVED*** ExpressPeerServer ***REMOVED*** = require('peer');

const io = require('socket.io')(server, ***REMOVED***
	cors: ***REMOVED***
		origin: '*',
		method: ['GET', 'POST']
	***REMOVED***
***REMOVED***);

app.use(cors());

const peerServer = ExpressPeerServer(server, ***REMOVED***
	debug: true,
	path: '/'
***REMOVED***);

app.use('/peerjs', peerServer);

const PORT = 5053;

app.get('/', (req, res) => ***REMOVED***
	res.send('server is running');
***REMOVED***);



const userSocketIdMap = new Map(); //a map of online userIds and their clients

const addClientToSocketMap = (userId, socketId) => ***REMOVED***
	if (!userSocketIdMap.has(userId)) ***REMOVED***
		//when user is joining first time
		userSocketIdMap.set(userId, new Set([socketId]));
	***REMOVED*** else ***REMOVED***
		//user had already joined from one client and now joining using another	client
		userSocketIdMap.get(userId).add(socketId);
	***REMOVED***
***REMOVED***

const removeClientFromSocketMap = (userId, socketId) => ***REMOVED***
	if (userSocketIdMap.has(userId)) ***REMOVED***
		let userSocketIdSet = userSocketIdMap.get(userId);
		userSocketIdSet.delete(socketId);
		//if there are no clients for a user, remove that user from online list (map)
		if (userSocketIdSet.size == 0) ***REMOVED***
			userSocketIdMap.delete(userId);
		***REMOVED***
	***REMOVED***
***REMOVED***

const getUserSocketId = (userId) => ***REMOVED***
	const userSocketIdSet = userSocketIdMap.get(userId);
	const socketId = [...userSocketIdSet][0];
	return socketId;
***REMOVED***

io.on("connection", (socket) => ***REMOVED***
	console.log('socket id: ', socket.id)
	let userId = socket.handshake.query.userId;
	addClientToSocketMap(userId, socket.id);
	console.log(`userId $***REMOVED***userId***REMOVED*** connected`);

	socket.on("disconnect", () => ***REMOVED***
		console.log('disconnected...')
		socket.broadcast.emit("callEnded");
		// remove this client from online list
		removeClientFromSocketMap(userId, socket.id);
	***REMOVED***);

	socket.on("end-call", (callData) => ***REMOVED***
		console.log('ending call', callData);
		socket.broadcast.emit("call-ended", callData);
	***REMOVED***);

	socket.on("send-message", (messageData) => ***REMOVED***
		console.log('sending message to user...', messageData.to.name);

		if (userSocketIdMap.has(messageData.to.userId)) ***REMOVED***
			const recipientSocketId = getUserSocketId(messageData.to.userId);

			const data = ***REMOVED*** ...messageData, sockets: ***REMOVED*** from: socket.id, to: recipientSocketId ***REMOVED*** ***REMOVED***;

			console.log('with socket id...', recipientSocketId);
			console.log(data);
			io.to(recipientSocketId).emit("send-message", data);
		***REMOVED***
		// else ***REMOVED***
		// 	console.log(`$***REMOVED***messageData.to.name***REMOVED*** is offline`)
		// 	io.to(socket.id).emit("user-offline", messageData);
		// 	console.log(socket.id);
		// ***REMOVED***
	***REMOVED***);

	socket.on("call-user", (callData) => ***REMOVED***
		console.log('calling user...', callData.callId.to.name);

		if (userSocketIdMap.has(callData.callId.to.userId)) ***REMOVED***
			const socketIdToCall = getUserSocketId(callData.callId.to.userId);

			const data = ***REMOVED*** ...callData, sockets: ***REMOVED*** from: socket.id, to: socketIdToCall ***REMOVED*** ***REMOVED***;

			// console.log('with socket id...', socketIdToCall);
			console.log(data);
			// socket.join(socketIdToCall);
			io.to(socketIdToCall).emit("call-user", data);
		***REMOVED*** else ***REMOVED***
			console.log(`$***REMOVED***callData.callId.to.name***REMOVED*** is offline`)
			io.to(socket.id).emit("user-offline", callData);
			console.log(socket.id);
		***REMOVED***
	***REMOVED***);

	socket.on("accept-call", (callData) => ***REMOVED***
		// console.log('accepted call: ', callData)
		if (callData && callData.callId && callData.callId.from && callData.callId.to) ***REMOVED***
			const socketIdToCall = getUserSocketId(callData.callId.from.userId);
			if (socketIdToCall) ***REMOVED***
				io.to(socketIdToCall).emit("call-connected", callData);
			***REMOVED***
		***REMOVED***
	***REMOVED***);
***REMOVED***);

server.listen(PORT, () => console.log(`server running on port $***REMOVED***PORT***REMOVED***`));