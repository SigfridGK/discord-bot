// PT Join
exports.ptJoin = function (message, client) { 
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
}

// PT Create
exports.ptCreate = function (message, client) { 
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
}