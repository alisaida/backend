const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');
const { ExpressPeerServer } = require('peer');

const io = require('socket.io')(server, {
	cors: {
		origin: '*',
		method: ['GET', 'POST']
	}
});

app.use(cors());

const peerServer = ExpressPeerServer(server, {
	debug: true,
	path: '/'
});

app.use('/peerjs', peerServer);

const PORT = 5053;

app.get('/', (req, res) => {
	res.send('server is running');
});



const userSocketIdMap = new Map(); //a map of online userIds and their clients

const addClientToSocketMap = (userId, socketId) => {
	if (!userSocketIdMap.has(userId)) {
		//when user is joining first time
		userSocketIdMap.set(userId, new Set([socketId]));
	} else {
		//user had already joined from one client and now joining using another	client
		userSocketIdMap.get(userId).add(socketId);
	}
}

const removeClientFromSocketMap = (userId, socketId) => {
	if (userSocketIdMap.has(userId)) {
		let userSocketIdSet = userSocketIdMap.get(userId);
		userSocketIdSet.delete(socketId);
		//if there are no clients for a user, remove that user from online list (map)
		if (userSocketIdSet.size == 0) {
			userSocketIdMap.delete(userId);
		}
	}
}

const getUserSocketId = (userId) => {
	const userSocketIdSet = userSocketIdMap.get(userId);
	const socketId = [...userSocketIdSet][0];
	return socketId;
}

io.on("connection", (socket) => {
	console.log('socket id: ', socket.id)
	let userId = socket.handshake.query.userId;
	addClientToSocketMap(userId, socket.id);
	console.log(`userId ${userId} connected`);

	socket.on("disconnect", () => {
		console.log('disconnected...')
		socket.broadcast.emit("callEnded");
		// remove this client from online list
		removeClientFromSocketMap(userId, socket.id);
	});

	socket.on("end-call", (callData) => {
		console.log('ending call', callData);
		socket.broadcast.emit("call-ended", callData);
	});

	socket.on("send-message", (messageData) => {
		console.log('sending message to user...', messageData.to.name);

		if (userSocketIdMap.has(messageData.to.userId)) {
			const recipientSocketId = getUserSocketId(messageData.to.userId);

			const data = { ...messageData, sockets: { from: socket.id, to: recipientSocketId } };

			console.log('with socket id...', recipientSocketId);
			console.log(data);
			io.to(recipientSocketId).emit("send-message", data);
		}
		// else {
		// 	console.log(`${messageData.to.name} is offline`)
		// 	io.to(socket.id).emit("user-offline", messageData);
		// 	console.log(socket.id);
		// }
	});

	socket.on("call-user", (callData) => {
		console.log('calling user...', callData.callId.to.name);

		if (userSocketIdMap.has(callData.callId.to.userId)) {
			const socketIdToCall = getUserSocketId(callData.callId.to.userId);

			const data = { ...callData, sockets: { from: socket.id, to: socketIdToCall } };

			// console.log('with socket id...', socketIdToCall);
			console.log(data);
			// socket.join(socketIdToCall);
			io.to(socketIdToCall).emit("call-user", data);
		} else {
			console.log(`${callData.callId.to.name} is offline`)
			io.to(socket.id).emit("user-offline", callData);
			console.log(socket.id);
		}
	});

	socket.on("accept-call", (callData) => {
		// console.log('accepted call: ', callData)
		if (callData && callData.callId && callData.callId.from && callData.callId.to) {
			const socketIdToCall = getUserSocketId(callData.callId.from.userId);
			if (socketIdToCall) {
				io.to(socketIdToCall).emit("call-connected", callData);
			}
		}
	});
});

server.listen(PORT, () => console.log(`server running on port ${PORT}`));