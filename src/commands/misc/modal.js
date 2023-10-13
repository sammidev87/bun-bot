const { Client, ChatInputCommandInteraction, SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("modal")
        .setDescription("Returns a modal."),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const modal = new ModalBuilder()
            .setCustomId(`test-modal`)
            .setTitle(`Favorite Color?`);

        const textInput = new ActionRowBuilder().addComponents(
            new TextInputBuilder()
                .setCustomId(`favColorInput`)
                .setLabel(`What is your favorite color?`)
                .setRequired(true)
                .setStyle(TextInputStyle.Short)
        );

        modal.addComponents(textInput);

        await interaction.showModal(modal);

    }
};