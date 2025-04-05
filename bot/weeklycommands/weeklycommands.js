const indexJS = require('../index.js')
const db = require('../server/select.js')
const { blockQuote, bold } = require('discord.js');

// Weekly Create
exports.weeklycreate = function (message) { 
    if (message.content.toLowerCase().includes("@ptnotify")){
		const messageArr = message.content.split(" ");
		if (messageArr.length >= 2) {
			const channel = message.channel
			var ptName = messageArr[1]
			if (messageArr.length > 2) {
				ptName = message.content.replace("@ptnotify ", "")
			}

			db.selectPTTypeMembers(ptName, async function(res) {
				if (res.data == []) {
					return;
				}
				const members = res.data.split("::")
				var idList = ""
		
				if (members.length > 0) {
					members.forEach(element => {
						if (element.length > 0) {
							idList += "<@" + element + "> "
						}
					});
				}
		
				channel.send(idList).then(repliedMessage => {
					setTimeout(() => repliedMessage.delete(), 300);
				});
		
				const botMsgContent = blockQuote('Pong!\n🔸 Party Type '+bold(ptName));
				message.reply({
					content: botMsgContent,
				})
			})
		}
    }
}