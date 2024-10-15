const indexJS = require('./index.js')

// PT JOIN via REACT
exports.ptJOIN = function (reaction, user) { 
    const msg = reaction.message.content
    const msgPTCheckher = ">>> _New party posted!\\n🔸 _";
	if (msg.includes(msgPTCheckher)) return;
	if (reaction.emoji.name != '✅') return;
	if (user.bot) return;
	try {
		const trimMsg = msg.replace(msgPTCheckher,"")+";"
		const regex = /\*{2}(.*?)\*{2};/g
		const ptName = regex.exec(trimMsg);
		if (ptName.length < 1) return;

        let i = indexJS.partyNameList.findIndex(pt => pt.name == ptName[1])
        var members = indexJS.partyNameList[i].memberlist;
        indexJS.partyNameList[i].memberlist = members +"::"+user.id
	} catch {
	  return;
	};
}

// PT LEFT via REACT
exports.ptLeave = function (reaction, user) { 
    const msg = reaction.message.content
    const msgPTCheckher = ">>> _New party posted!\\n🔸 _";
	if (msg.includes(msgPTCheckher)) return;
	if (reaction.emoji.name != '✅') return;
	try {
		const trimMsg = msg.replace(msgPTCheckher,"")+";"
		const regex = /\*{2}(.*?)\*{2};/g
		const ptName = regex.exec(trimMsg);
		if (ptName.length < 1) return;

        let i = indexJS.partyNameList.findIndex(pt => pt.name == ptName[1])
        var members = indexJS.partyNameList[i].memberlist;
        var arrMember = members.split("::")
        arrMember = arrMember.filter(pt => pt != user.id)
        indexJS.partyNameList[i].memberlist = arrMember.join("::")
	} catch {
	  return;
	};
}