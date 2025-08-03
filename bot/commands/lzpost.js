const { SlashCommandBuilder, blockQuote, bold, italic, EmbedBuilder } = require('discord.js');
const indexJS = require('../index.js')
const db = require('../server/select.js')
const axios = require('axios');
const vision = require('@google-cloud/vision');
const clientVision = new vision.ImageAnnotatorClient();

async function detectTextFromBuffer(url,stg,interaction) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageBuffer = response.data;

    const [result] = await clientVision.textDetection({ image: { content: imageBuffer } });
    const detections = result.textAnnotations;

    if (detections.length, 
        detections[0].description.includes("Lipius LUCKY ZONE")) {
        const lzdungeon = detections[0].description
        const regex = /<([^>]+)>/g;

        let match;
        const results = [];

        while ((match = regex.exec(lzdungeon)) !== null) {
            results.push(match[1]); // this is the text inside < >
        }

        await interaction.deferReply({ ephemeral: false });
        const title = "☼✧₊∘▬▬▬▬▬▬▬▬▬ ⚔︎ ▬▬▬▬▬▬▬▬▬∘₊✧☼"
        const postedWeeklyEmbed = new EmbedBuilder()
        var msg = ""

        var stg = stg
        var nestArr = [results[3],results[4]]
        var dungeonsArr = [results[0], results[1], results[2]]
        async function step(i) {
            switch (i) {
            case 1:
                postedWeeklyEmbed
                    .setColor(0x0099FF)
                    .setThumbnail(interaction.guild.iconURL())

                msg = title+"\n\n"+bold("Weekly Torch:")+"\n"+stg+"\n\n -";
                step(2);
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

                        postedWeeklyEmbed.addFields({ 
                            name: dungeonName, 
                            value: dg.dropmaterial +" -> "+ dg.portalname 
                        })
                    }); 
                    step(3);
                });
                break;
            case 3:
                db.selectNest(nestArr, async function(res) {
                    postedWeeklyEmbed.addFields({ name: '-', value: " " })
                    await res.data.forEach(i => {
                        if (i.nestname.split(':').length > 0) {
                            const result = i.nestname.split(':')[1].trim();
                            postedWeeklyEmbed.addFields({ 
                                name: result, 
                                value: i.dropmaterial +" -> "+ i.portalname 
                            })
                        }
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
    } else {
    console.log('No text found.');
    }
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('lzpost')
		.setDescription('Gyazo Anypublic image URL screenshot')
        .addStringOption(option =>
            option.setName('image')
                .setDescription('generate LZ week')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('stg')
                .setDescription('post stg torch')
                .setRequired(true)
        ),
	async execute(interaction) {
        detectTextFromBuffer(
            interaction.options.getString('image'),
            interaction.options.getString('stg'),
            interaction
        );
	},
};