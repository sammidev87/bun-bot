const { Client, ChatInputCommandInteraction } = require("discord.js");
const PollDB = require("../../schemas/pollDB");

module.exports = {
    data: {
        name: `Poll-Option1`,
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

            const optionField1 = pollEmbed.fields[ 0 ];

            const newOption1Count = parseInt(optionField1.value) + 1;
            optionField1.value = newOption1Count;

            data = new PollDB({
                Guild: guild.id,
                User: user.id,
                Message: message.id,
                Answer: optionField1.name,
            });
            await data.save();

            interaction.reply({ content: `Your vote has been counted!`, ephemeral: true });
            message.edit({ embeds: [ pollEmbed ] });

        } else if (data) {

            return interaction.reply({ content: `You have already voted!`, ephemeral: true });

        }

    }
};