const { Client, Message, Events, EmbedBuilder } = require("discord.js");
const CharactersDB = require("../../schemas/charactersDB");

module.exports = {
    name: Events.MessageCreate,

    /**
     * 
     * @param { Message } message 
     * @param { Client } client 
     */
    async execute(message, client) {

        const { channel, guild, member, content, author } = message;
        const { color } = client;
        const sleep = async (ms) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, ms || 0);
            });
        };

        if (message.webhookId || author.bot) return;

        const split = content.split(` `);
        const proxy = split[ 0 ];
        const Message = content.split(` `).slice(1).join(` `);

        const data = await CharactersDB.findOne({ GuildID: guild.id, MemberID: member.id, Proxy: proxy }).catch(err => console.error(err));
        if (!data) return;

        const webhook = await channel.createWebhook({ name: data.Name, avatar: data.Avatar }).catch(err => console.error(err));

        if (message.type === 19) {

            const ReplyMessage = await message.channel.messages.fetch(message.reference.messageId);

            const Embed = new EmbedBuilder()
                .setColor(color)
                .setThumbnail(`https://cdn.discordapp.com/attachments/${ReplyMessage.author.avatar}`)
                .setTitle(`${ReplyMessage.author.username} ↩️`)
                .setDescription(`${ReplyMessage.content}`)
                .setFooter({ text: "Character Creation by Bun Bot" })
                .setTimestamp();

            try {
                const webhooks = await channel.fetchWebhooks();
                const webhook = webhooks.find(wh => wh.token);

                if (!webhook) {
                    return console.log('No webhook was found that I can use!');
                }

                await webhook.send({
                    content: Message,
                    username: data.Name,
                    avatarURL: data.Avatar,
                    embeds: [ Embed ]
                });
            } catch (error) {
                console.error('Error trying to send a message: ', error);
            }

            await sleep(500);

            message.delete();

            await webhook.delete();

        } else {

            try {
                const webhooks = await channel.fetchWebhooks();
                const webhook = webhooks.find(wh => wh.token);

                if (!webhook) {
                    return console.log('No webhook was found that I can use!');
                }

                await webhook.send({
                    content: Message,
                    username: data.Name,
                    avatarURL: data.Avatar,
                });
            } catch (error) {
                console.error('Error trying to send a message: ', error);
            }

            await sleep(500);

            message.delete();

            await webhook.delete();

        }

    }

};