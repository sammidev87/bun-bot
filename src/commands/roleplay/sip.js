const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sip")
        .setDescription("Sip.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to show.").setRequired(false))
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
        else if (!Text && Mention) pingText = ` ${Mention}`;
        else if (Text && Mention) pingText = ` ${Mention} ${Text}`;

        const gifs = [ 'https://ucarecdn.com/6a545294-21d6-479d-8d3d-dec6bb4941f5/sip.gif',
            'https://ucarecdn.com/55f62282-77fa-49f2-aadb-539ff06cef14/sip2.gif',
            'https://ucarecdn.com/d5d5c23b-d126-4eeb-9fdf-f4a27f4500a5/sip4.gif',
            'https://ucarecdn.com/f5258873-f7f6-4923-9a7d-4ecddf6b8681/sip5.gif',
            'https://ucarecdn.com/532f92f2-4e72-4ad6-8389-2925553bfe7c/sip1.gif',
            'https://ucarecdn.com/66465023-7c00-40bb-93fc-4a04672eec6b/sip3.gif', ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(colorData.Color || color)
            .setTitle("Sip")
            .setDescription(`${member} sips${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};