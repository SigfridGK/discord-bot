const commonlib = require('../../common/common.js');
const ptCommand = require('../../ptcommands/ptcommands.js');

exports.initMessageCreateEvent = function (Events, client) { 
    client.on(Events.MessageCreate, async message => {
        const channelID = message.channelId
        if (commonlib.checkIsPVEChannel(channelID, client) && !message.author.bot) {
            ptCommand.ptJoin(message)
            ptCommand.ptLeave(message)
            ptCommand.ptPing(message)
            ptCommand.ptNotify(message)
            return;
        }
    });
}