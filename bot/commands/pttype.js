const { SlashCommandBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const indexJS = require('../index.js')
const db = require('../server/select.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pttype')
		.setDescription('Display pt type list'),
	async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const user = interaction.user
        db.selectPTType("*", async function(res) {
            const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Party Notify ')
                .setDescription('Select the button of party type you want to be notified.')
                .addFields({ name: '@ptnotify [PT_TYPE]', value: ' ' })
                .setThumbnail(interaction.guild.iconURL())

            const row = new ActionRowBuilder();
            await res.data.forEach(i => {
                const arrMember = i.members.split("::")
                const isMember = arrMember.includes(user.id)
                const button = new ButtonBuilder()
                    .setCustomId("ptt_"+i.pt_type)
                    .setEmoji(i.emoji_icon)
                    .setLabel(i.pt_type)
                    .setStyle(isMember ? ButtonStyle.Success : ButtonStyle.Secondary);

                row.addComponents(button)
            });

            await interaction.editReply({ 
                embeds: [exampleEmbed],
                components: [row],
                ephemeral: true
            });
        })
	},
};