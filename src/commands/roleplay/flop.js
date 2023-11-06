const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("flop")
        .setDescription("Flop.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to flop at.").setRequired(false))
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

        const gifs = [ 'https://ucarecdn.com/2a947636-d8ca-4a68-94bd-5f2ce8216537/flop.gif',
            'https://ucarecdn.com/4b8d598a-1b00-495a-b37b-6c1e5234b279/flop2.gif',
            'https://ucarecdn.com/a40d231c-2285-4a88-b741-3d76a3f2fab1/flop3.gif',
            'https://ucarecdn.com/b5a3d857-86c1-4d54-a732-1d3c040a881c/flop4.gif',
            'https://ucarecdn.com/efc16bee-f786-443d-a300-1447bac6fc1f/flop1.gif',
            'https://ucarecdn.com/05f6bae9-3161-466a-95c6-e791ebf0fcc7/flop5.gif', ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle("Flop")
            .setDescription(`${member} flops${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};