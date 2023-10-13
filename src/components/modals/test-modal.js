const { Client, ModalSubmitInteraction } = require("discord.js");

module.exports = {
    data: {
        name: `test-modal`,
    },

    /**
     * 
     * @param { ModalSubmitInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {
        const { fields } = interaction;
        const color = fields.getTextInputValue("favColorInput");
        await interaction.reply({ content: `You said your favorite color was ${color}` });
    }
};