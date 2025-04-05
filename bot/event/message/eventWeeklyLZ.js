const commonlib = require('../../common/common.js');

exports.initMessageCreateEvent = function (Events, client) { 
    client.on(Events.MessageCreate, async message => {
        const channelID = message.channelId
        if (commonlib.checkIsNewsChannel(channelID, client) && !message.author.bot) {
            console.log("2222")
        }
        
    });
}