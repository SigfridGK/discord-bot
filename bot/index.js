const fs = require('node:fs');
const path = require('node:path');
const ptCommand = require('./ptcommands/ptcommands.js');
const reactionEvent = require('./eventReaction.js');
const buttonEvent = require('./eventButton.js');
const dbSelect = require('./server/select.js')

// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits, Partials, ButtonStyle } = require('discord.js');
const { token } = require('../config.json');
exports.partyNameList = [];

// Create a new client instance
const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(foldersPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	dbSelect.selectPTList(async function(res){
		if (res.data == '[]') return;
		exports.partyNameList = JSON.parse(res.data)
	})
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	const channelID = interaction.channelId
	client.channels.fetch(channelID).then(async channel => {
		switch (channel.name) {
			case "PVE":
				if (interaction.isChatInputCommand()) {
					const command = interaction.client.commands.get(interaction.commandName);
				
					if (!command) {
						console.error(`No command matching ${interaction.commandName} was found.`);
						return;
					}
				
					try {
						await command.execute(interaction);
					} catch (error) {
						console.error(error);
						if (interaction.replied || interaction.deferred) {
							await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
						} else {
							await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
						}
					}
					
				} else if (interaction.isAutocomplete()) {
					const command = interaction.client.commands.get(interaction.commandName);
			
					if (!command) {
						console.error(`No command matching ${interaction.commandName} was found.`);
						return;
					}
			
					try {
						await command.autocomplete(interaction);
					} catch (error) {
						console.error(error);
					}

				} else if (interaction.isButton()) {
					buttonEvent.ptTypeButton(interaction)
				}
				break;
			default:
			break;
		}
	});
});



//////////////////////////////////////  
// Events ACTION HERE				//
//////////////////////////////////////
client.on(Events.MessageCreate, async message => {
	const channelID = message.channelId
	client.channels.fetch(channelID).then(channel => {
		switch (channel.name) {
			case "PVE":
				ptCommand.ptJoin(message)
				ptCommand.ptLeave(message)
				ptCommand.ptPing(message)
				ptCommand.ptNotify(message)
				break;
		
			default:
			break;
		}
	});
});

client.on(Events.MessageReactionRemove, async (reaction, user) => {
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch {}
	}
	const channelID = reaction.message.channelId
	client.channels.fetch(channelID).then(channel => {
		switch (channel.name) {
			case "PVE":
				reactionEvent.ptLeave(reaction, user)
				break;
		
			default:
			break;
		}
	});
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch {}
	}

	const channelID = reaction.message.channelId
	client.channels.fetch(channelID).then(channel => {
		switch (channel.name) {
			case "PVE":
				reactionEvent.ptJOIN(reaction, user)
				break;
		
			default:
			break;
		}
	});
});


client.on(Events.TypingStart, async (reaction, user) => {
	const channelID = reaction.message.channelId
	client.channels.fetch(channelID).then(channel => {
		switch (channel.name) {
			case "PVE":
				reactionEvent.ptJOIN(reaction, user)
				break;
		
			default:
			break;
		}
	});
});


// start
client.login(token);