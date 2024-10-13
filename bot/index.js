const fs = require('node:fs');
const path = require('node:path');

// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js');
const { token } = require('../config.json');

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
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

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
});

client.on(Events.MessageCreate, async message => {
    if (message.content.includes("@ptJOIN")){
		const messageArr = message.content.split(" ");
		if (messageArr.length == 2) {
			const guild = client.guilds.cache.get(message.guildId);
            const threads = guild.channels.cache.filter(x => x.isThread());
			
			const arrThreads = Array.from(threads.values());
			const thread = arrThreads.filter(x => x.id === messageArr[1]);
			if (thread.length > 0) {
				const user = message.author.id;
				thread[0].members.add(user)
			}
		}
    }
});

// Log in to Discord with your client's token
client.login(token);