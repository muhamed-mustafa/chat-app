const express  = require('express'),
      path     = require('path'),
      http     = require('http'),
      socketio = require('socket.io'),
      formatMessage = require('./utils/messages'),
      { userJoin , getCurrentUser , userLeave , getRoomUsers } = require('./utils/users'); 

const app    = express();
const server = http.createServer(app);
const io     = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname , 'public')));

const botName = 'ChatBord';

// Runs when client connects
io.on('connection' , socket =>
{
    socket.on('joinRoom' , ({username , room}) =>
    {
        const user = userJoin(socket.id , username , room);

        // to specific to join to any room
        socket.join(user.room);

        // Welcome to current user or single user from server.
        socket.emit('message' , formatMessage(botName , `Welcome to ChatCord ${user.username}!`));

        // BroadCast when user connects except current user.
        socket.broadcast.to(user.room).emit('message' , formatMessage(botName ,`${user.username} has joined the chat`));

        // send room and users info
        io.to(user.room).emit('roomUsers' , {
            room  : user.room ,
            users : getRoomUsers(user.room)
        });

    });

    // Listen for message from client 
    socket.on('chatMessage' , msg =>
    {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message' ,formatMessage(user.username , msg));
    });
    
    socket.on('disconnect' , () =>
    {
        const user = userLeave(socket.id);
        if(user)
        {
            // send message to all users.
            io.to(user.room).emit('message' , formatMessage(botName , `${user.username} has left the chat!`));

             // send room and users info
            io.to(user.room).emit('roomUsers' , {
                room  : user.room ,
                users : getRoomUsers(user.room)
            });
        }
    });
});

const PORT = 3000 || process.env.PORT;
server.listen(PORT , () => console.log(`Server running on port ${PORT}`));
