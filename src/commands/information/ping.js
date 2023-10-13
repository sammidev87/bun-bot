const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Shows the bot's current latency"),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { ws, color } = client;

        const Embed = new EmbedBuilder()
            .setColor(color)
            .setTitle("Ping:")
            .setDescription(`The current latency is: \`${ws.ping} ms\``)
            .setFooter({ text: `Ping by Bun Bot` })
            .setTimestamp();

        interaction.reply({ embeds: [ Embed ] });

    }
};