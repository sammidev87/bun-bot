const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("blow-kiss")
        .setDescription("Blow a kiss to someone.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to blow a kiss to.").setRequired(false))
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

        const gifs = [ 'https://ucarecdn.com/fd8f925d-24ff-441b-a172-091146c2df0b/blowkiss2.gif',
            'https://ucarecdn.com/1c5c12cd-267c-4328-ab78-a6d6cbe825de/blowkiss5.gif',
            'https://ucarecdn.com/bf625fa4-8231-4ad8-b11a-07bcf7058539/blowkiss4.gif',
            'https://ucarecdn.com/9a302b7c-1807-4cbf-abdd-841f555ba4ae/blowkiss9.gif',
            'https://ucarecdn.com/bd112db7-73b9-403b-9457-c4f1b6efbf97/blowkiss3.gif',
            'https://ucarecdn.com/3f1065d1-4522-47ef-aef8-aea4e3888567/blowkiss8.gif',
            'https://ucarecdn.com/4b3dbc0e-8054-40b7-9bf1-9b1c3d14c202/blowkiss.gif',
            'https://ucarecdn.com/b4f6e1d4-0d34-43a8-9c33-6588214b6e32/blowkiss1.gif',
            'https://ucarecdn.com/ed909433-27e3-4d92-aae6-f4c2bd9563c2/blowkiss7.gif',
            'https://ucarecdn.com/8619252a-b5f7-4c12-9b9b-8145f6d1dea9/blowkiss6.gif' ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle("Blow Kiss")
            .setDescription(`${member} blows a kiss${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};