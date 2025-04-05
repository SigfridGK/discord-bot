
const { Client, GatewayIntentBits, Partials } = require('discord.js');
exports.initClient = function () { 
    const initClient = new Client({ 
        intents: [
            GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ],
        partials: [Partials.Message, Partials.Channel, Partials.Reaction]
    });

    return initClient;
}