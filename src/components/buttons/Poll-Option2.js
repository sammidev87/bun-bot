const { Client, ChatInputCommandInteraction } = require("discord.js");
const PollDB = require("../../schemas/pollDB");

module.exports = {
    data: {
        name: `Poll-Option2`,
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

            const optionField2 = pollEmbed.fields[ 1 ];

            const newOption2Count = parseInt(optionField2.value) + 1;
            optionField2.value = newOption2Count;

            data = new PollDB({
                Guild: guild.id,
                User: user.id,
                Message: message.id,
                Answer: optionField2.name,
            });
            await data.save();

            interaction.reply({ content: `Your vote has been counted!`, ephemeral: true });
            message.edit({ embeds: [ pollEmbed ] });

        } else if (data) {

            return interaction.reply({ content: `You have already voted!`, ephemeral: true });

        }

    }
};