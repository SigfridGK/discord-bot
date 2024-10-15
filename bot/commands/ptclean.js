const { SlashCommandBuilder, blockQuote, bold, italic } = require('discord.js');
const indexJS = require('../index.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ptclean')
		.setDescription('Clean bot messages.'),
	async execute(interaction) {
        interaction.channel.messages
        .fetch({ 
          limit: 100 
        })
        .then((messages) => {
            const botMessages = messages.filter((msg) => msg.author.bot)
      
            interaction.channel.bulkDelete(botMessages)
            interaction.reply({
                content: "Party Chats cleaned.",
                ephemeral: true
            }).then(msg => {
                setTimeout(() => msg.delete(), 2200);
            })
        })
	},
};