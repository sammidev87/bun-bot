const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("cry")
        .setDescription("Cry.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to cry at.").setRequired(false))
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

        const gifs = [ 'https://ucarecdn.com/13dc9f32-557c-4250-9239-f3f093ffa60a/cry2.gif',
            'https://ucarecdn.com/31f9fb31-81c9-4044-ab30-f0c88cee83b8/cry8.gif',
            'https://ucarecdn.com/82ecbcb1-6557-4016-9833-8b69104dc01e/cry7.gif',
            'https://ucarecdn.com/962380d7-4ae5-49ec-8137-f16383d76a14/cry6.gif',
            'https://ucarecdn.com/34cfb25a-9deb-4f42-8c63-1fe55ae24bd2/cry3.gif',
            'https://ucarecdn.com/04739679-5595-4443-aa09-6836ca2274e1/cry1.gif',
            'https://ucarecdn.com/1302f547-767b-43f1-8f56-875f4d9303cc/cry9.gif',
            'https://ucarecdn.com/18e2c385-4a1c-48ae-8171-ed3ff7b01e02/cry4.gif',
            'https://ucarecdn.com/324f37da-17e9-41d1-8337-6c8be731d8f3/cry.gif',
            'https://ucarecdn.com/ad582cc0-bfcc-426d-8e2b-ee5299991d9b/cry11.gif',
            'https://ucarecdn.com/986febb1-cb00-4577-8f04-32452a9953a9/cry5.gif',
            'https://ucarecdn.com/217c009b-4bc9-4abc-bbb6-7885815b4815/cry10.gif' ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle("Cry")
            .setDescription(`${member} cries${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};