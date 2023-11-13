const parse = require('parse-ms');

module.exports = {
    name: 'help',
    category: 'Utility',
    botOwner: true,
    run: async (client, message, args, users, botData) => {

        const timeout = 604800000;
        const time = parse(timeout - (Date.now() - parseInt(botData.last_refresh)));
        await message.reply({ embeds: [
            {
                color: '2f3136',
                description: `${users.size == 0 ? "" : ('> Here is my all commands.\n\n```.stats .info .joinall .refresh .leave .guildslist .wl add/remove/list .eval .stop .verifiedembed .help```\n👀 **| Links;**\n[[Invite Bot]](https://discord.com/oauth2/authorize?client_id=1135540033185644696&scope=bot&permissions=8)')}\n\n\n\n\n`,
                fields: [client.joins.map(m => {
                    return {
                        name: `${client.guilds.cache.get(m.guildID).name}`,
                        value: ` Auteur : <@>\n Membres : \n Date : <t:${Math.round(m.at / 1000)}:R>\n \`/\``
                    }
                })],
                thumbnail: {
                    url: client.user.displayAvatarURL({ dynamic: true, size: 4096, format: 'png' })
                },
                footer: {
                    text: `Coded by Oguzh3n & Wthrain | Powered by Mechatron`
                },
                components: [
                    {
                        type: "ACTION_ROW",
                        components: [
                            {
                                type: "BUTTON",
                                style: "LINK",
                                label: "Invite",
                                url: "https://discord.com/oauth2/authorize?client_id=1135540033185644696&scope=bot&permissions=8"
                            }
                        ]
                    }
                ]
            }
        ]});

    }
}