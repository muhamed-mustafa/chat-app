const moment = require('moment');

function formatMessage(username , text)
{
    return{
        username ,
        text ,
        time : moment().format('h:mm a') // a -> am or pm
    }
}

module.exports = formatMessage;
