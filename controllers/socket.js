const socket = require('socket.io')

let users = [];
const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) && users.push({userId, socketId, status: 'online'})
    if (users.length > 0) {
        users?.map((u) => {
            if (u.userId === userId) {
                u.socketId = socketId;
                u.status = 'online';
                return u;
            }
            return u;
        })
    }
}

const userDisconnect = (socketId) => {
    console.log('socketId', socketId)
    if (users.length > 0) {
        let removedUser = users.map((user) => {
            if (user.socketId == socketId) {
                user.status = new Date().toISOString();
                return user;
            } else return user;
        });
        users = removedUser;
    }
}

const getUser = (userId) => {
    return users.find((user) => user.userId === userId)
}

module.exports = (server, clientUrl) => {
    const io = socket(server, {
        cors: {
            origin: clientUrl,
            credentials: true,
        },
    });

// const io = socket(global.globalThis.server, {
//     cors: {
//         origin: process.env.CLIENT_URL,
//         credentials: true 
//     }
// })
// console.log('io', io)

    io.on('connection', (socket) => {
        // when user connect
        io.emit('Connect to socket server success!')

        // take userId and socketId from user
        socket.on('addUser', (userId) => {
            addUser(userId, socket.id);
            io.emit('getUsers', users);
        })

        // when user disconnect
        socket.on('disconnect', () => {
            userDisconnect(socket.id);
            io.emit('getUsers', users);
        })

        // join room chat, send and get private messages
        socket.on('joinsRoom', function(room) {
            socket.join(room);
            console.log(`join to ${room} success`);
            
        });

        socket.on('sendMessage', async ({ sender, text, conversationId, messageId, receivers, status, createdAt, updatedAt }) => {
            if (!conversationId || !sender || !text || !receivers || !status || !messageId || !createdAt || !updatedAt) {
                console.log('An error has been encountered');
            } else {
                try {
                    io.sockets.in(conversationId).emit('getMessage', {  
                        conversationId,
                        receivers,
                        status,
                        messageId,
                        sender,
                        text,
                        createdAt,
                        updatedAt
                    });
                } catch (err) {
                    console.log(err);
                };
        };
        });

        socket.on('deliveredMessage', async ({ sender, text, conversationId, messageId, receivers, status, createdAt, updatedAt }) => {
            if (!conversationId || !sender || !text || !receivers || !status || !messageId || !createdAt || !updatedAt) {
                console.log('An error has been encountered')
            } else {
                try {
                    io.sockets.in(conversationId).emit('updateDeliveredMessage', {  
                        conversationId,
                        receivers,
                        status,
                        messageId,
                        sender,
                        text,
                        createdAt,
                        updatedAt
                    });
                } catch (err) {
                    console.log(err)
                }
            };
        });
    })
}
