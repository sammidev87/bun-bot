const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("giggle")
        .setDescription("Giggle.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to giggle at.").setRequired(false))
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

        const gifs = [ 'https://ucarecdn.com/78454eb3-c734-473b-99e7-3eb9a0f403f4/giggle.gif',
            'https://ucarecdn.com/f0b7522a-6d14-42ee-9fd1-417a4727f9ba/giggle4.gif',
            'https://ucarecdn.com/5d42ecac-2783-473d-a8ca-ccb7443d6b78/giggle5.gif',
            'https://ucarecdn.com/73b34f12-0215-41a0-8b1e-7c50db92e0f1/giggle1.gif',
            'https://ucarecdn.com/2d761b7b-c572-4f1d-9ab2-920d3a343c55/giggle3.gif',
            'https://ucarecdn.com/08a21783-c4cb-4d15-a37d-fe930e332e0f/giggle2.gif', ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle("Giggle")
            .setDescription(`${member} giggles${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });
    }
};