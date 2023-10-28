const { Client, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const PollDB = require("../../schemas/pollDB");
const colorDB = require("../../schemas/colorDB");

module.exports = {
    data: {
        name: `Poll-End`,
    },
    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { guild, user, message } = interaction;
        const { color } = client;
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        let embedColor;
        if (!colorData) {
            embedColor = color;
        } else {
            embedColor = colorData.Color;
        }

        const Member = guild.members.cache.get(user.id);

        if (!Member.roles.highest.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: `You do not have the permission to end the poll!`, ephemeral: true });

        const pollEmbed = message.embeds[ 0 ];
        if (!pollEmbed) return interaction.reply({ content: `Unable to find poll embed!`, ephemeral: true });

        const optionField1 = pollEmbed.fields[ 0 ];
        const optionField2 = pollEmbed.fields[ 1 ];
        const optionField3 = pollEmbed.fields[ 2 ];
        const optionField4 = pollEmbed.fields[ 3 ];

        const pollData = await PollDB.find({ Guild: guild.id, Message: message.id }).catch(err => console.error(err));
        const answers = [];
        pollData.forEach(data => {
            answers.push(`**User:** <@${data.User}> **Answer:** ${data.Answer}`);
        });

        const desc = [ `**User Answers:**
                
                ${answers}` ];

        const Embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle("Poll Ended")
            .setDescription(`${desc}`)
            .setFields(
                {
                    name: `${optionField1.name}`,
                    value: `${optionField1.value}`,
                    inline: true,
                },
                {
                    name: `${optionField2.name}`,
                    value: `${optionField2.value}`,
                    inline: true,
                },
                {
                    name: `${optionField3.name}`,
                    value: `${optionField3.value}`,
                    inline: true,
                },
                {
                    name: `${optionField4.name}`,
                    value: `${optionField4.value}`,
                    inline: true,
                },
            )
            .setFooter({ text: "Poll by Bun Bot" })
            .setTimestamp();

        PollDB.deleteMany({ Guild: guild.id, Message: message.id }).catch(err => console.error(err));

        message.edit({ embeds: [ Embed ], components: [] });

    }
};