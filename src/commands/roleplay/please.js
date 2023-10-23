const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("please")
        .setDescription("Please.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to say please to.").setRequired(false))
        .addStringOption(opt => opt.setName("text").setDescription("Message you want to say.").setRequired(false)),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { member, options } = interaction;
        const { color } = client;
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));

        const Text = options.getString("text");
        const Mention = options.getUser("user");
        let pingText = ``;
        if (!Text && !Mention) pingText = ``;
        if (Text && !Mention) pingText = ` ${Text}`;
        else if (!Text && Mention) pingText = ` to ${Mention}`;
        else if (Text && Mention) pingText = ` to ${Mention} ${Text}`;

        const gifs = [ 'https://ucarecdn.com/9f72278b-afb1-4ff3-9c3c-e9b5e1e9bf1a/please.gif',
            'https://ucarecdn.com/c56f740d-0061-4403-b770-8a4d8a0260b5/please5.gif',
            'https://ucarecdn.com/d98ede87-a359-4219-9b69-7708d27ac08e/please3.gif',
            'https://ucarecdn.com/881951b9-b50a-41ce-b1c8-2705dcf3194b/please1.gif',
            'https://ucarecdn.com/7f7d8398-ec94-4ea0-b92d-b6fb618bcb7b/please4.gif',
            'https://ucarecdn.com/48aad856-5296-498f-b63b-b191703550e5/please2.gif', ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(colorData.Color || color)
            .setTitle("Please")
            .setDescription(`${member} says please please please pleeeeaaassssseeeeeeeee${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};