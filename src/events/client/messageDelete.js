const { Client, Message, Events, EmbedBuilder } = require("discord.js");
const CountingDB = require("../../schemas/countingDB");
const ReactionRolesDB = require("../../schemas/reactionRolesDB");

module.exports = {
    name: Events.MessageDelete,

    /**
     * 
     * @param { Message } message 
     * @param { Client } client 
     */
    async execute(message, client) {

        const { id, guild, member, channel } = message;
        const { color } = client;

        //Deleted Count
        let countData = await CountingDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        let reactData = await ReactionRolesDB.findOne({ Guild: guild.id, MessageId: id }).catch(err => console.error(err));

        if (countData) {
            if (countData.LastMessageId === id) {
                channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(color)
                            .setTitle("Deleted Message")
                            .setDescription(`<@${member.id}> has deleted their count of ${countData.Count}`)
                            .setFooter({ text: `Counting by Bun Bot.` })
                            .setTimestamp()
                    ]
                });
            }
        } else if (reactData) {
            reactData.MessageId = ``;
            await reactData.save();
        } else {
            return;
        }

    }

};