const { ButtonStyle, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const indexJS = require('./index.js')
const db = require('./server/update.js')

exports.ptTypeButton = async function(interaction) {
    const userID = interaction.user.id
    var iid = interaction.customId
    var isSuccess = false
    if (iid.startsWith("ptt_")) {
        iid = iid.replace("ptt_","")
        var req = "CONCAT(members, '::"+userID+"')";
        if (interaction.component.data.style == ButtonStyle.Success) {
            isSuccess = true
            req = "REPLACE(members, '::"+userID+"', '')";
        }
        db.updatePTType(req, iid, async function(res){
            //loop through each action row on the embed and update it accordingly
            let newActionRowEmbeds = interaction.message.components.map(oldActionRow => {

                //create a new action row to add the new data
                updatedActionRow = new ActionRowBuilder();
                
                // Loop through old action row components (which are buttons in this case)
                updatedActionRow.addComponents(oldActionRow.components.map(buttonComponent => {

                    //create a new button from the old button, to change it if necessary
                    newButton = ButtonBuilder.from(buttonComponent)
                    
                    //if this was the button that was clicked, this is the one to change!
                    if(interaction.customId == buttonComponent.customId){
                        newButton.setStyle(isSuccess ? ButtonStyle.Secondary : ButtonStyle.Success)
                    }
                    return newButton
                }));
                return updatedActionRow
            });
            
            // and then finally update the message
            await interaction.update({components: newActionRowEmbeds})
        })
    }
}