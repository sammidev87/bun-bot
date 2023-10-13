const { Client, ChatInputCommandInteraction, SlashCommandBuilder, SelectMenuBuilder, SelectMenuOptionBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("menu")
        .setDescription("Select Menu"),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const menu = new ActionRowBuilder().addComponents(new SelectMenuBuilder()
            .setCustomId(`sub-menu`)
            .setMinValues(1)
            .setMaxValues(1)
            .setOptions(new SelectMenuOptionBuilder({
                label: `Option #1`,
                value: `Testing out the select menu.`,
            }), new SelectMenuOptionBuilder({
                label: `Option #2`,
                value: `Testing it out again.`
            })));

        await interaction.reply({ components: [ menu ] });

    }
};