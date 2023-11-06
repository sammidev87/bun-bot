const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("overwhelmed")
        .setDescription("Tell others you are overwhelmed.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to tell.").setRequired(false))
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

        const gifs = [ 'https://ucarecdn.com/b1a9c726-9525-4fe1-b6e4-7ead7e0caeb4/overwhelmed3.gif',
            'https://ucarecdn.com/851092b1-36df-4fb3-829d-e88fafe4474e/overwhelmed.gif',
            'https://ucarecdn.com/70e67dee-e30e-4d5a-9df7-176cfb05b82e/overwhelmed4.gif',
            'https://ucarecdn.com/70c1e2f6-6d9a-4537-b5ab-447e11a1c16f/overwhelmed5.gif',
            'https://ucarecdn.com/9ed2e32a-b8e8-4c42-bf69-fe9ccf22c09c/overwhelmed1.gif',
            'https://ucarecdn.com/8d9ac174-ccb7-4e03-8ac0-6e4b769e53f6/overwhelmed2.gif' ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle("Overwhelmed")
            .setDescription(`${member} is overwhelmed${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};