const { Client, Message, EmbedBuilder, Events } = require("discord.js");
const SafeWordDB = require("../../schemas/safeWordDB");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    name: Events.MessageCreate,

    /**
     * 
     * @param { Message } message 
     * @param { Client } client 
     */
    async execute(message, client) {

        const { content, guild } = message;
        const { emojilist, color } = client;
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        let embedColor;
        if (!colorData) {
            embedColor = color;
        } else {
            embedColor = colorData.Color;
        }

        //Safe Word
        const data = await SafeWordDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        if (!data) return;

        if (content.includes(`${data.SafeWord}`)) {

            const Embed = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle(`Safe Word | ${emojilist.cross}`)
                .setDescription("The safe word has been spoken! Please change the subject of the conversation and an admin will be here shortly to handle the situation.")
                .setFooter({ text: "Safe Word by Bun Bot" })
                .setTimestamp();

            message.reply({ content: `${data.Role}`, embeds: [ Embed ] }).then(msg => { message.delete(); });

        }

    }

};