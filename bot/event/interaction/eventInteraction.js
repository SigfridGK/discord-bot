const commonlib = require('../../common/common.js');
const buttonEvent = require('./eventButton.js');

exports.initInteractionEvent = function (Events, client) { 
    client.on(Events.InteractionCreate, async interaction => {
        const channelID = interaction.channelId
        if (commonlib.checkIsPVEChannel(channelID, client) == false) {
            commonlib.commonInteractionReply(interaction)
            return;
        }
        
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
        
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
        
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                commonlib.commonInteractionReply(interaction)
            }
            
        } else if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(interaction.commandName);
    
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
    
            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(error);
                commonlib.commonInteractionReply(interaction)
            }

        } else if (interaction.isButton()) {
            buttonEvent.ptTypeButton(interaction)
        }
    });
}