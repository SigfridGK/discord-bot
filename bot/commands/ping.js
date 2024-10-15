const { SlashCommandBuilder, blockQuote, bold } = require('discord.js');
const indexJS = require('../index.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
		.addStringOption(option =>
			option.setName('partyname')
				.setDescription('Ping PT members!')
				.setRequired(true)
				.setAutocomplete(true)),
	async autocomplete(interaction) {
		const user = interaction.user
		const focusedValue = interaction.options.getFocused();
		let choices = indexJS.partyNameList.map(pt => {
			if (pt.memberlist.includes(user.id)) {
				return pt.name
			}
			return null
		})
		if (choices.length < 1 ) return;

		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	},
	async execute(interaction) {
        const channel = interaction.channel
        const ptName = 	interaction.options.getString('partyname');
		if (ptName == null) return;

        let i = indexJS.partyNameList.findIndex(pt => pt.name == ptName)
		if (i == -1) {
			const botMsgContent = blockQuote('Party did not exist!\n🔸 Party '+bold(ptName));
			await interaction.reply({
				content: botMsgContent,
				ephemeral: true
			})
			return;
		}

        const members = indexJS.partyNameList[i].memberlist.split("::")
		var idList = ""

		await members.forEach(element => {
			idList += "<@" + element + "> "
		});

		channel.send(idList).then(repliedMessage => {
			setTimeout(() => repliedMessage.delete(), 300);
		});

		const botMsgContent = blockQuote('Pong!\n🔸 Party '+bold(ptName));
		await interaction.reply({
			content: botMsgContent,
		})
	},
};