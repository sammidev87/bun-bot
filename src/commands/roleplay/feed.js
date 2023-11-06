const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("feed")
        .setDescription("Feed someone.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to feed.").setRequired(false))
        .addStringOption(opt => opt.setName("text").setDescription("Message you want to say.").setRequired(false)),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { member, options, guild } = interaction;
        const { color } = client;
        const colorData = await colorDB.findOne({ Guild: guild.id }).catch(err => console.error(err));
        let embedColor;
        if (!colorData) {
            embedColor = color;
        } else {
            embedColor = colorData.Color;
        }

        const Text = options.getString("text");
        const Mention = options.getUser("user");
        let pingText = ``;
        if (!Text && !Mention) pingText = ``;
        if (Text && !Mention) pingText = ` ${Text}`;
        else if (!Text && Mention) pingText = ` ${Mention}`;
        else if (Text && Mention) pingText = ` ${Mention} ${Text}`;

        const gifs = [ 'https://ucarecdn.com/23158e92-3cc9-4488-bc26-9dc6ba6a1d06/feed.gif',
            'https://ucarecdn.com/ffd285f4-272f-4d1b-8bb7-d03658f920a7/feed3.gif',
            'https://ucarecdn.com/cf0a135b-fd5e-464e-87d3-17df19e1c03a/feed2.gif',
            'https://ucarecdn.com/fc46ac41-243e-40aa-9d44-1ebe811ec7ae/feed5.gif',
            'https://ucarecdn.com/c4df6c1c-e102-4292-9b5f-596dc403dc2f/feed4.gif',
            'https://ucarecdn.com/6aea1bf4-1ad0-4f53-b4ad-8801cce3769a/feed1.gif', ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle("Feed")
            .setDescription(`${member} feeds${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};