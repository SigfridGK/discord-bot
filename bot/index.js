const eventInteraction = require('./event/interaction/eventInteraction.js');
const eventMessageCreate = require('./event/message/eventMessageCreate.js');
const eventReactionRemove = require('./event/reaction/eventRemoveReaction.js');
const eventReactionAdd = require('./event/reaction/eventAddReaction.js');
const commonLib = require('./common/common.js')
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
commonLib.commonInitCommandsPath(client)

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

//////////////////////////////////////  
// Events ACTION HERE				//
//////////////////////////////////////
eventInteraction.initInteractionEvent(Events, client)
eventMessageCreate.initMessageCreateEvent(Events, client)
eventReactionAdd.initReactionAddEvent(Events, client)
eventReactionRemove.initReactionRemoveEvent(Events, client)

// start
client.login(token);