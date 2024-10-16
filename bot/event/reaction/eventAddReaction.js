const commonlib = require('../../common/common.js');
const reactionEvent = require('./eventReaction.js');

exports.initReactionAddEvent = function (Events, client) { 
    client.on(Events.MessageReactionAdd, async (reaction, user) => {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch {}
        }

        const channelID = reaction.message.channelId
        if (commonlib.checkIsPVEChannel(channelID, client) == false) {
            commonlib.commonInteractionReply(reaction)
            return;
        }
        reactionEvent.ptJOIN(reaction, user)
    });
}