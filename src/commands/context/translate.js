const { Client, ContextMenuCommandInteraction, ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require("discord.js");
const translate = require("@iamtraction/google-translate");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("translate-app")
        .setType(ApplicationCommandType.Message),

    /**
     * 
     * @param { ContextMenuCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { color, guild } = client;
        const { targetId, channel } = interaction;
        const query = await channel.messages.fetch({ message: targetId });
        const content = query.content;
        const translation = await translate(query, { to: "en" });
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        let embedColor;
        if (!colorData) {
            embedColor = color;
        } else {
            embedColor = colorData.Color;
        }

        const Embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle("Translator")
            .setDescription(`What you requested to be translated:`)
            .setFields(
                {
                    name: `Original Message:`,
                    value: "```" + content + "```",
                },
                {
                    name: `Translated Message:`,
                    value: "```" + translation.text + "```",
                },
            )
            .setFooter({ text: `Translator by Bun Bot` })
            .setTimestamp();

        interaction.reply({ embeds: [ Embed ], ephemeral: true });

    }
};