const { SlashCommandBuilder, blockQuote, bold } = require('discord.js');
const indexJS = require('../index.js')

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
		let choices = indexJS.partyNameList.map(pt => {
			if (pt.pl == user.id) {
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
        const ptName = 	interaction.options.getString('partyname');
		if (ptName == null) return;

        let i = indexJS.partyNameList.findIndex(pt => pt.name == ptName)
        indexJS.partyNameList.splice(i,1);
        
		const botMsgContent = blockQuote('Party has been disbanded.\n🔸 Party '+bold(ptName));
		await interaction.reply({
			content: botMsgContent,
            ephemeral: true
		})
	},
};