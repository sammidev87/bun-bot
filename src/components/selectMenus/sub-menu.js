const { Client, SelectMenuInteraction } = require("discord.js");

module.exports = {
    data: {
        name: "sub-menu",
    },

    /**
     * 
     * @param { SelectMenuInteraction } interaction
     * @param { Client } client
     */
    async execute(interaction, client) {

        const { values } = interaction;

        interaction.reply({ content: `You have selected: ${values[ 0 ]}` });

    }
};