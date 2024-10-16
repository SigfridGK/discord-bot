const { SlashCommandBuilder, blockQuote, bold, italic, EmbedBuilder } = require('discord.js');
const indexJS = require('../index.js')
const dbInsert = require('../server/insert.js')
const dbUpdate = require('../server/update.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ptcreate')
		.setDescription('Create party name')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('party name')
                .setRequired(true)),
	async execute(interaction) {
        const user = interaction.user
        const threadName = 	interaction.options.getString('title') ?? "'Raid-Private-Thread";

        try {
            if(indexJS.partyNameList.filter(pt => pt.name.includes(threadName)).length > 0){
                const botMsgContent = blockQuote('💥 Oops PT Name already exist.');
                await interaction.reply({ 
                    content: botMsgContent,
                    ephemeral: true
                })
                return;
            }
            
            const botMsgContent = blockQuote(italic('New party posted!\n🔸 ')+bold(threadName));
            await interaction.reply({ 
                content: botMsgContent,
                fetchReply: true
            }).then(msg => {
                var ptInfo = {
                    name: threadName,
                    ptMsgID: msg.id,
                    pl: user.id,
                    memberlist: user.id
                }
                indexJS.partyNameList.push(ptInfo)
                msg.react('✅')
                dbUpdate.updatePTList(indexJS.partyNameList)
            })

        } catch (error) { 
            console.log(error); 
        } 
	},
};