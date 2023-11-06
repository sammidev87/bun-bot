const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const colorDB = require("../../schemas/colorDB");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("run")
        .setDescription("Run away.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to run away from.").setRequired(false))
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
        else if (!Text && Mention) pingText = ` from ${Mention}`;
        else if (Text && Mention) pingText = ` from ${Mention} ${Text}`;

        const gifs = [ 'https://ucarecdn.com/0e45bbdb-b8ce-4597-8cbb-b88ce7599b79/run.gif',
            'https://ucarecdn.com/b2e4f38b-ad60-4c76-9e61-5df4ffa2e946/run2.gif',
            'https://ucarecdn.com/4e181fe5-0584-4809-a6e7-9edb6dbe105e/run4.gif',
            'https://ucarecdn.com/2ec790f9-d578-4405-aa87-02f8dce0b91e/run3.gif',
            'https://ucarecdn.com/475248e7-f624-4213-a99e-c0f473a2ba67/run5.gif',
            'https://ucarecdn.com/b9a49719-99ba-414e-b61a-703da7feb8c3/run1.gif', ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle("Run")
            .setDescription(`${member} runs away${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};