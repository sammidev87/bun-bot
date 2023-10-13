const { Client, ContextMenuCommandInteraction, ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require("discord.js");
const translate = require("@iamtraction/google-translate");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("translate")
        .setType(ApplicationCommandType.Message),

    /**
     * 
     * @param { ContextMenuCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { color } = client;
        const { targetId, channel } = interaction;
        const query = await channel.messages.fetch({ message: targetId });
        const content = query.content;
        const translation = await translate(query, { to: "en" });

        const Embed = new EmbedBuilder()
            .setColor(color)
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