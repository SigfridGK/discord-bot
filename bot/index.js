const eventInteraction = require('./event/interaction/eventInteraction.js');
const eventMessageCreate = require('./event/message/eventMessageCreate.js');
// const eventMessageLZWeekly = require('./event/message/eventWeeklyLZ.js');
const eventReactionRemove = require('./event/reaction/eventRemoveReaction.js');
const eventReactionAdd = require('./event/reaction/eventAddReaction.js');
const initClient = require('./client/client.js');
const commonLib = require('./common/common.js');
const dbSelect = require('./server/select.js');

// Require the necessary discord.js classes
const { Collection, Events } = require('discord.js');
const { token } = require('../config.json');
exports.partyNameList = [];

// Initialize client instance
const client = initClient.initClient();
client.commands = new Collection();
commonLib.commonInitCommandsPath(client)

// When the client is ready, run this code (only once).
client.once(Events.ClientReady, readyClient => {
	dbSelect.selectPTList(async function(res){
		if (res.data == []) return;
		exports.partyNameList = JSON.parse(res.data)
	})

	//////////////////////////////////////  
	// Events ACTION HERE				//
	//////////////////////////////////////
	eventInteraction.initInteractionEvent(Events, client)
	eventMessageCreate.initMessageCreateEvent(Events, client)
	// eventMessageLZWeekly.initMessageCreateEvent(Events, client)
	eventReactionAdd.initReactionAddEvent(Events, client)
	eventReactionRemove.initReactionRemoveEvent(Events, client)

	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// start
client.login(token);