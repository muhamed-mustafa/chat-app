const users = [];

// join user to chat
function userJoin(id , username , room) 
{
    const user = {id , username , room};

    users.push(user);

    return user;
}

// get Current user by id
function getCurrentUser(id) 
{
    return users.find(user => user.id === id);
}

// user leave chat
function userLeave(id)
{
    const index = users.findIndex(user => user.id === id);

    if(index !== 1)
    {
        return users.splice(index , 1)[0];
    }
}

// filter users by room
function getRoomUsers(room)
{
    return users.filter(user => user.room === room);
}

module.exports =
{
    userJoin , 
    getCurrentUser ,
    userLeave , 
    getRoomUsers
};
