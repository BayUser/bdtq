const parse = require('parse-ms');

module.exports = {
    name: 'info',
    category: 'Utility',
    botOwner: true,
    run: (client, message, args, users, botData) => {

        const timeout = 604800000;
        const time = parse(timeout - (Date.now() - parseInt(botData.last_refresh)));
        message.channel.send({ embeds: [
            {
                color: client.color.default,
                description: `**${client.emoji.arrow} Number of users: \`${users.size == 0 ? "Loading..." : users.length.toLocaleString('en-US')}\`\n\n${client.emoji.arrow} Authentication link: [link](${client.config.authlink})\n${client.emoji.arrow} Bot link: [link](${client.config.botlink})\n\n${client.emoji.arrow} Join in progress:**`,
                fields: [client.joins.map(m => {
                    return {
                        name: `${client.guilds.cache.get(m.guildID).name}`,
                        value: `${client.emoji.author} Author: <@${m.author}>\n${client.emoji.member} Members: \`${m.members}\`\n${client.emoji.date} Date: <t:${Math.round(m.at / 1000)}:R>\n${client.emoji.progress} Progress: \`${m.progress}/${users.length}\``
                    }
                })],
                thumbnail: {
                    url: client.user.displayAvatarURL({ dynamic: true, size: 4096, format: 'png' })
                },
                footer: {
                    text: `Next refresh in ${time.days}d, ${time.hours}h, ${time.minutes}m`
                },
            }
        ]})

    }
}
