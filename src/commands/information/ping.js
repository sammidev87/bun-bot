const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

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
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        let embedColor;
        if (!colorData) {
            embedColor = color;
        } else {
            embedColor = colorData.Color;
        }

        const Embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle("Ping:")
            .setDescription(`The current latency is: \`${ws.ping} ms\``)
            .setFooter({ text: `Ping by Bun Bot` })
            .setTimestamp();

        interaction.reply({ embeds: [ Embed ] });

    }
};