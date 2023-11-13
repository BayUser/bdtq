module.exports = {
    name: 'leave',
	category: 'Admin',
	ownerOnly: true,
    run: (client, message, args, users) => {

		const id = args[0];
		if(!id) return message.channel.send('Error');


		const guild = client.guilds.cache.get(id);
		if(!guild) return message.channel.send("Le bot ne se trouve pas sur ce serveur")
		guild.leave();
		message.channel.send(`**${guild.name}** quitté avec succès`);


    }
}