const { SlashCommandBuilder, blockQuote, bold, strikethrough } = require('discord.js');
const indexJS = require('../index.js')
const dbUpdate = require('../server/update.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ptdisband')
		.setDescription('Disband Party')
		.addStringOption(option =>
			option.setName('partyname')
                .setDescription('Party name to disband')
				.setRequired(true)
				.setAutocomplete(true)),
	async autocomplete(interaction) {
		const user = interaction.user
		const focusedValue = interaction.options.getFocused();

		var choices = []
		indexJS.partyNameList.forEach(item => {
			if (item.pl == user.id) {
				return choices.push(item.name)
			}
		});
		if (choices.length < 1 ) return;
		
		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	},
	async execute(interaction) {
        const ptName = 	interaction.options.getString('partyname');
		if (ptName == null) return;
        
		const botMsgContent = blockQuote('Party has been disbanded.\n🔸 Party '+bold(ptName));
		await interaction.reply({
			content: botMsgContent,
            ephemeral: true
		}).then(msg => {
			let i = indexJS.partyNameList.findIndex(pt => pt.name == ptName)
			if (i == -1) return;

			interaction.channel.messages.fetch(indexJS.partyNameList[i].ptMsgID).then(messages => {
				const botMsgContent = blockQuote(strikethrough('New party posted!\n🔸 ')+strikethrough(ptName));
				messages.edit(botMsgContent);
				messages.reactions.removeAll()
			})
			indexJS.partyNameList.splice(i,1);
			dbUpdate.updatePTList(indexJS.partyNameList)
		})
	},
};