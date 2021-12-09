const chatForm     = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName     = document.getElementById('room-name');
const userList     = document.getElementById('users');

const socket = io();

// to get username , room from URL
const { username , room } = Qs.parse(location.search , {
    ignoreQueryPrefix : true ,
});


// get room and users info
socket.on('roomUsers' , ({room , users}) =>
{
    outputRoomName(room);
    outputUsers(users);
});

// Join to chatRoom
socket.emit('joinRoom' , ({ username , room }));

// Message from server to clients.
socket.on('message' , message =>
{
    console.log(message);
    outputMessage(message);

    // to make scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message Server
chatForm.addEventListener('submit' , (e) =>
{
    e.preventDefault();

    // Get Message text
    const msg = e.target.elements.msg.value; // target to get current element

    // Send message to server 
    socket.emit('chatMessage' , msg);

    // to clear input after send message.
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

function outputMessage(message)
{
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;

    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room)
{
    roomName.innerText = room;
}

function outputUsers(users) 
{
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}
