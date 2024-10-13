const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
        const channel = interaction.channel
        const members = channel.members
		var idList = ""

		await members.fetch().then(member => {
			const id = Array.from(member.keys());
			id.forEach(element => {
				idList += "<@" + element + "> "
			});
		});

		channel.send(idList).then(repliedMessage => {
			setTimeout(() => repliedMessage.delete(), 1500);
		});

		await interaction.reply({
			content: 'Pong!',
			ephemeral: true,
		})
	},
};