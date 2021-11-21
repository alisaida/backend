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

const PORT = 5000;

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
		if (callData.sockets.to)
			io.to(callData.sockets.to).emit("call-ended", callData);
		if (callData.sockets.from)
			io.to(callData.sockets.from).emit("call-ended", callData);
	***REMOVED***);

	socket.on("call-user", (callData) => ***REMOVED***
		console.log('calling user...', callData.callId.to.name);

		if (userSocketIdMap.has(callData.callId.to.userId)) ***REMOVED***
			const userSocketIdSet = userSocketIdMap.get(callData.callId.to.userId);
			const socketIdToCall = [...userSocketIdSet][0];

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
		console.log('accepted call...')
		console.log('callData', callData)
		const userSocketIdSet = userSocketIdMap.get(callData.callId.to.userId);
		const socketIdToCall = [...userSocketIdSet][0];
		io.to(socketIdToCall).emit("accept-call", callData);
	***REMOVED***);
***REMOVED***);

server.listen(PORT, () => console.log(`server running on port $***REMOVED***PORT***REMOVED***`));