const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("wag")
        .setDescription("Wag your tail.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to wag your tail at.").setRequired(false))
        .addStringOption(opt => opt.setName("text").setDescription("Message you want to say.").setRequired(false)),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction 
     * @param { Client } client 
     */
    async execute(interaction, client) {

        const { member, options } = interaction;
        const { color } = client;

        const Text = options.getString("text");
        const Mention = options.getUser("user");
        let pingText = ``;
        if (!Text && !Mention) pingText = ``;
        if (Text && !Mention) pingText = ` ${Text}`;
        else if (!Text && Mention) pingText = ` ${Mention}`;
        else if (Text && Mention) pingText = ` ${Mention} ${Text}`;

        const gifs = [ 'https://ucarecdn.com/9a09949e-592b-43d1-8f51-4a007629e28d/wag1.gif',
            'https://ucarecdn.com/b71a3ff5-ba36-4f72-863e-fd9dcb0c3218/wag2.gif',
            'https://ucarecdn.com/73070e18-d9f1-41f9-905c-0a4e77566154/wag5.gif',
            'https://ucarecdn.com/6d4c0350-e0dd-4e65-8a0a-35bd4bcb923c/wag3.gif',
            'https://ucarecdn.com/35f3f92d-7a17-4423-baf6-6667d37b8082/wag.gif',
            'https://ucarecdn.com/1e1bc586-8f71-4cd4-94b1-88958657994e/wag4.gif', ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle("Wag")
            .setDescription(`${member} wags their tail${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};