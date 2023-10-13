const { Client, ChatInputCommandInteraction } = require("discord.js");
const PollDB = require("../../schemas/pollDB");

module.exports = {
    data: {
        name: `Poll-Option3`,
    },
    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { guild, user, message } = interaction;

        let data = await PollDB.findOne({ Guild: guild.id, User: user.id, Message: message.id }).catch(err => console.error(err));
        if (!data) {

            const pollEmbed = message.embeds[ 0 ];
            if (!pollEmbed) return interaction.reply({ content: `Unable to find poll embed!`, ephemeral: true });

            const optionField3 = pollEmbed.fields[ 2 ];

            const newOption3Count = parseInt(optionField3.value) + 1;
            optionField3.value = newOption3Count;

            data = new PollDB({
                Guild: guild.id,
                User: user.id,
                Message: message.id,
                Answer: optionField3.name,
            });
            await data.save();

            interaction.reply({ content: `Your vote has been counted!`, ephemeral: true });
            message.edit({ embeds: [ pollEmbed ] });

        } else if (data) {

            return interaction.reply({ content: `You have already voted!`, ephemeral: true });

        }

    }
};