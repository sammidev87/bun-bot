const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pick-up")
        .setDescription("Pick someone up.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to pick up.").setRequired(false))
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

        const gifs = [ 'https://ucarecdn.com/ab62e0ca-76e1-42ce-bd64-6ecbd9bd4f4c/pickup1.gif',
            'https://ucarecdn.com/0794d40b-b362-4884-abfc-123f856315e8/pickup2.gif',
            'https://ucarecdn.com/25e1b7d2-533f-459f-942b-f19fa2202e57/pickup4.gif',
            'https://ucarecdn.com/f367e999-ba04-4224-8f0c-c63d29a60ff5/pickup3.gif',
            'https://ucarecdn.com/890bb5a5-d36a-4337-82f6-0dc8ed2ea557/pickup.gif',
            'https://ucarecdn.com/b2f8e1a5-aac5-40ed-b751-efb4dec89d20/pickup5.gif', ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(colorData.Color || color)
            .setTitle("Pick Up")
            .setDescription(`${member} picks up${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};