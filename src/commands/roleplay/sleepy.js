const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sleepy")
        .setDescription("Sleepy.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to show you are sleepy.").setRequired(false))
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

        const gifs = [ 'https://ucarecdn.com/33f18350-f33a-4565-84ed-78b84d4f670b/sleepy2.gif',
            'https://ucarecdn.com/33ae7760-6f28-4450-b53f-b0ec67bee492/sleepy.gif',
            'https://ucarecdn.com/3f7d62f8-93c9-488c-ad54-d1cc3d8d41d9/sleepy5.gif',
            'https://ucarecdn.com/72b1cce0-1cfe-4b90-9790-470eadf40e7b/sleepy3.gif',
            'https://ucarecdn.com/68295a16-b477-4c36-af3d-5d2cbc1c646a/sleepy4.gif',
            'https://ucarecdn.com/7c08c7ce-0394-4a24-ab97-815141ef52d0/sleepy1.gif', ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle("Sleepy")
            .setDescription(`${member} is sleepy${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};