const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("cuddle")
        .setDescription("Cuddle someone.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to cuddle.").setRequired(false))
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

        const gifs = [ 'https://ucarecdn.com/b6d9ece3-a47f-44c2-8fa2-abf37c436f8c/cuddle6.gif',
            'https://ucarecdn.com/350d0539-1531-46d3-958d-dbe6fc2666a7/cuddle3.gif',
            'https://ucarecdn.com/b07c0a17-da18-4ed3-9d1d-5f6009a5c402/cuddle4.gif',
            'https://ucarecdn.com/32cdf1e4-d0ed-4f56-9cba-db45d918cc30/cuddle2.gif',
            'https://ucarecdn.com/7851de95-80cd-48cd-bfc0-d77b76bd6561/cuddle1.gif',
            'https://ucarecdn.com/546c2c50-0f81-4bc1-9e4c-469fa7a81730/cuddle9.gif',
            'https://ucarecdn.com/0f787b87-6294-4adc-bcbc-3eecec85f7e8/cuddle5.gif',
            'https://ucarecdn.com/aa3b29fe-ffe6-4853-a891-589c0628fcc6/cuddle8.gif',
            'https://ucarecdn.com/fe499e0b-8e21-4600-9ac8-49c8396e9ba7/cuddle.gif',
            'https://ucarecdn.com/4d19fddc-d8dd-4de5-89f5-1ac900bcd0de/cuddle7.gif' ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle("Cuddle")
            .setDescription(`${member} cuddles${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};