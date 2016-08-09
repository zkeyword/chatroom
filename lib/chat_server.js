var socketio = require('socket.io');
var guestNumber = 1;
var nickName = {};
var namesUsed = [];
var currentRoom = {};

exports.listen = (server) => {
    let io = socketio.listen(server);
	
    io.set('log level', 1);
	
    io.sockets.on('connection', function (socket) {
        guestNumber = assignGuestName(socket, guestNumber, nickName, namesUsed);
        joinRoom(socket, 'Lobby', nickName);
        joinRoom(socket, 'Lobby2', nickName);
        handleMessageBroadcasting(socket, nickName);
        handleNameChangeAttempts(socket, nickName, namesUsed);
        handleRoomJoining(socket, nickName);
        socket.on('rooms', function () {
            socket.emit('rooms', io.sockets.manager.rooms);
        });
        handleClientDisconnection(socket, nickName, namesUsed);
    })
	
	return io;
	
	function assignGuestName(socket, guestNumber, nickName, namesUsed) {
		var name = 'Guest' + guestNumber;
		nickName[socket.id] = name;
		socket.emit('nameResult', {
			success: true,
			name: name
		});
		namesUsed.push(name);
		return guestNumber + 1;
	}

	function joinRoom(socket, room, nickName) {
		socket.join(room);
		currentRoom[socket.id] = room;
		socket.emit('joinResult', {room: room});
		var messageText = nickName[socket.id] + ' has joined ' + room + ',';
		socket.broadcast.to(room).emit('message', {
			text: messageText
		});
		var usersInRoom = io.sockets.clients(room);
		if (usersInRoom.length > 1) {
			var usersInRoomSummary = 'Users currently in ' + room + ': ';
			for (var index in usersInRoom) {
				var userSocketId = usersInRoom[index].id;
				if (userSocketId != socket.id) {
					if (index > 0) {
						usersInRoomSummary += ',';
					}
				}
				usersInRoomSummary += nickName[userSocketId];
			}
			usersInRoomSummary += '.';
			socket.emit('message', {text: usersInRoomSummary});
		}
	}

	function handleNameChangeAttempts(socket, nickName, namesUsed) {
		socket.on('nameAttempt', function (name) {
			if (name.indexOf('Guest') == 0) {
				socket.emit('nameResult', {
					success: false,
					message: 'Name cannot begin with "Guest".'
				});
				return;
			}
			if (namesUsed.indexOf(name) == -1) {
				var previousName = nickName[socket.id];
				var previousNameIndex = namesUsed.indexOf(previousName);
				namesUsed.push(name);
				nickName[socket.id] = name;
				delete namesUsed[previousNameIndex];
				socket.emit('nameResult', {
					success: true,
					name: name
				});
				socket.broadcast.to(currentRoom[socket.id]).emit('message', {
					text: previousName + ' is now known as ' + name + '.'
				});
				return;
			}
			socket.emit('nameResult', {
				success: true,
				message: 'That name is already in use.'
			});
		});
	}

	function handleMessageBroadcasting(socket, nickName) {
		socket.on('message', function (message) {
			socket.broadcast.to(message.room).emit('message', {
				text: nickName[socket.id] + ': ' + message.text
			});
		});
	}

	function handleRoomJoining(socket, nickName) {
		socket.on('join', function (room) {
			socket.leave(currentRoom[socket.id]);
			joinRoom(socket, room.newRoom, nickName);
		})
	}

	function handleClientDisconnection(socket, nickName, namesUsed) {
		socket.on('disconnect', function () {
			var nameIndex = namesUsed.indexOf(nickName[socket.id]);
			delete namesUsed[nameIndex];
			delete nickName[socket.id];
		})
	}
};