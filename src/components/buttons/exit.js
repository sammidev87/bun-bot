const { Client, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    data: {
        name: `exit`,
    },
    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { message } = interaction;

        message.delete();

    }
};