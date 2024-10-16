const indexJS = require('../index.js')
const db = require('../server/select.js')
const { blockQuote, bold } = require('discord.js');

// PT Join
exports.ptJoin = function (message) { 
    if (message.content.toLowerCase().includes("@ptjoin")){
		const messageArr = message.content.split(" ");
		if (messageArr.length >= 2) {
			const user = message.author
			var ptName = messageArr[1]
			if (messageArr.length > 2) {
				ptName = message.content.replace("@ptjoin ", "")
			}
			
			let i = indexJS.partyNameList.findIndex(pt => pt.name == ptName)
			if (i == -1) return;

			var members = indexJS.partyNameList[i].memberlist;
			indexJS.partyNameList[i].memberlist = members +"::"+user.id

			const botMsgContent = blockQuote('You join the party.\n🔸 Party '+bold(ptName));
			message.reply({
				content: botMsgContent,
				ephemeral: true
			}).then(msg => {
				setTimeout(() => msg.delete(), 1200);
			})
		}
    }
}

// PT LEAVE
exports.ptLeave = function (message) { 
    if (message.content.toLowerCase().includes("@ptleave")){
		const messageArr = message.content.split(" ");
		if (messageArr.length >= 2) {
			const user = message.author
			var ptName = messageArr[1]
			if (messageArr.length > 2) {
				ptName = message.content.replace("@ptleave ", "")
			}

			let i = indexJS.partyNameList.findIndex(pt => pt.name == ptName)
			if (i == -1) return;

			var members = indexJS.partyNameList[i].memberlist;
			var arrMember = members.split("::")
			arrMember = arrMember.filter(pt => pt != user.id)
			indexJS.partyNameList[i].memberlist = arrMember.join("::")

			const botMsgContent = blockQuote('You left the party.\n🔸 Party '+bold(ptName));
			message.reply({
				content: botMsgContent,
				ephemeral: true
			}).then(msg => {
				setTimeout(() => msg.delete(), 1200);
			})
		}
    }
}

// PT LEAVE
exports.ptPing = function (message) { 
    if (message.content.toLowerCase().includes("@ptping")){
		const messageArr = message.content.split(" ");
		if (messageArr.length >= 2) {
			const channel = message.channel
			var ptName = messageArr[1]
			if (messageArr.length > 2) {
				ptName = message.content.replace("@ptping ", "")
			}
	
			let i = indexJS.partyNameList.findIndex(pt => pt.name == ptName)
			if (i == -1) {
				const botMsgContent = blockQuote('Party did not exist!\n🔸 Party '+bold(ptName));
				message.reply({
					content: botMsgContent,
					ephemeral: true
				}).then(msg => {
					setTimeout(() => msg.delete(), 2200);
				})
				return;
			}
	
			const members = indexJS.partyNameList[i].memberlist.split("::")
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
	
			const botMsgContent = blockQuote('Pong!\n🔸 Party '+bold(ptName));
			message.reply({
				content: botMsgContent,
			})
		}
    }
}


// PT Notify
exports.ptNotify = function (message) { 
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