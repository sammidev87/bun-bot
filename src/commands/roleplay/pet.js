const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pet")
        .setDescription("Pet someone.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to pet.").setRequired(false))
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

        const gifs = [ 'https://ucarecdn.com/30f8e291-1b83-43b0-8a5a-e9217ad3ba8b/pet2.gif',
            'https://ucarecdn.com/ae7cd333-6327-45bf-88ec-69dee671120c/pet3.gif',
            'https://ucarecdn.com/168c02ac-0864-44b2-aa56-81f8e3b26b79/pet1.gif',
            'https://ucarecdn.com/620359ca-cad6-452a-aa22-5b505e7c9ed6/pet4.gif',
            'https://ucarecdn.com/e5deb14b-eb46-46b0-b3a6-c4de12ee69ce/pet5.gif',
            'https://ucarecdn.com/0496811a-f83b-4a38-80e4-40a744b8739e/pet.gif', ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle("Pet")
            .setDescription(`${member} pets${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};