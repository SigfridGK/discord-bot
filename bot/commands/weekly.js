const { SlashCommandBuilder, ButtonBuilder, EmbedBuilder, blockQuote, bold, italic } = require('discord.js');
const indexJS = require('../index.js')
const db = require('../server/select.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('weekly')
		.setDescription('Display the weekly grind'),
	async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });
        const title = "☼✧₊∘▬▬▬▬▬▬▬▬▬ ⚔︎ ▬▬▬▬▬▬▬▬▬∘₊✧☼"
        const postedWeeklyEmbed = new EmbedBuilder()
        var msg = ""

        var stg = ""
        var nestArr = []
        var dungeonsArr = []
        async function step(i) {
            switch (i) {
            case 1:
                db.selectWeekly("*", async function(res) {
                    await res.data.forEach(i => {
                        stg = i.stgweekly.replaceAll(",", " ")
                        dungeonsArr = i.lzweekly.split(",")
                        nestArr = i.nestweekly.split(",")
                    });

                    postedWeeklyEmbed
                        .setColor(0x0099FF)
                        .setThumbnail(interaction.guild.iconURL())

                    msg = title+"\n\n"+bold("Weekly Torch:")+"\n"+stg+"\n\n -";
                    step(2);
                })
                break;
            case 2:
                db.selectLZDungeon(dungeonsArr, async function(dungeonRes) {
                    await dungeonRes.data.forEach(dg => {
                        var dungeonName = ""
                        dungeonsArr.forEach(element => {
                            if (dg.dungeon.includes(element)) {
                                dungeonName = element
                                dungeonsArr.splice(dungeonsArr.indexOf(element), 1)
                            }
                        });

                        postedWeeklyEmbed.addFields({ name: dungeonName, value: dg.dropmaterial +" -> "+ dg.portalname })
                    }); 
                    step(3);
                });
                break;
            case 3:
                db.selectNest(nestArr, async function(res) {
                    postedWeeklyEmbed.addFields({ name: '-', value: " " })
                    await res.data.forEach(i => {
                        postedWeeklyEmbed.addFields({ name: i.nestname+" Nest", value: i.dropmaterial +" -> "+ i.portalname })
                    }); 
                    step(4);
                });
                break;
            case 4:
                postedWeeklyEmbed.setDescription(msg)
                await interaction.editReply({ 
                    embeds: [postedWeeklyEmbed],
                    components: [],
                    ephemeral: false
                });
                break;
            default:
                break;
            }
        }
        step(1);
	},
};

function capitalize(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}