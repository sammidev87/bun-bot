const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("laugh")
        .setDescription("Laugh at someone.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to laugh at.").setRequired(false))
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

        const gifs = [ 'https://ucarecdn.com/a0e72b55-7109-4f94-adf6-46ba7c5b7707/laugh.gif',
            'https://ucarecdn.com/07eca440-eb43-46ae-893c-c3c410b5bf22/laugh2.gif',
            'https://ucarecdn.com/f4e5b973-bf12-44af-84d7-01c3c0f85375/laugh5.gif',
            'https://ucarecdn.com/eef6a10f-4208-4ffb-ad5b-f40e08403d3d/laugh1.gif',
            'https://ucarecdn.com/2a6f7d50-de99-458f-af45-92914aa01c29/laugh4.gif',
            'https://ucarecdn.com/cd1db705-5227-42a9-92c4-6466eef04485/laugh3.gif', ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle("Laugh")
            .setDescription(`${member} laughs${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};