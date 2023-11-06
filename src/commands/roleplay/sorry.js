const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sorry")
        .setDescription("Say sorry.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to say sorry to.").setRequired(false))
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
        else if (!Text && Mention) pingText = ` to ${Mention}`;
        else if (Text && Mention) pingText = ` to ${Mention} ${Text}`;

        const gifs = [ 'https://ucarecdn.com/41543fed-fe75-469f-a9c2-679870874007/sorry.gif',
            'https://ucarecdn.com/7fb6a0fc-80d0-49db-8488-8e7104424cd1/sorry2.gif',
            'https://ucarecdn.com/b1cbdc3e-5993-49c4-8fe1-b5286193a2f0/sorry3.gif',
            'https://ucarecdn.com/a6a9834f-a2b7-4af3-81be-3595f1b420fe/sorry5.gif',
            'https://ucarecdn.com/9e154a0a-caa3-48af-86a6-218f148f4e04/sorry4.gif', ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle("Sorry")
            .setDescription(`${member} says sorry${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};