const { SlashCommandBuilder, ChannelType  } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pthread')
		.setDescription('Generate Thread')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Thread Title')
                .setRequired(false)),
	async execute(interaction) {
        const channel = interaction.channel
        const user = interaction.user
        const threadName = 	interaction.options.getString('title') ?? "'Raid-Private-Thread";

        try { 
            // Create a new private thread 
            const threadChannel = await channel.threads
            .create({ 
                name: threadName, 
                autoArchiveDuration: 60, 
                type: ChannelType.PrivateThread,
                reason: 'na',
            });
            await threadChannel.members.add(user);

            interaction.reply('🔸topic: '+threadName+'\n🔸@ptJOIN '+threadChannel.id);

        } catch (error) { 
            console.log(error); 
        } 
	},
};