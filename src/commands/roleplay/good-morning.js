const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("good-morning")
        .setDescription("Say good morning.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to tell good morning to.").setRequired(false))
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
        else if (!Text && Mention) pingText = ` to ${Mention}`;
        else if (Text && Mention) pingText = ` to ${Mention} ${Text}`;

        const gifs = [ 'https://ucarecdn.com/6f049df6-89db-4f17-8a0c-47b3414704ab/goodmorning2.gif',
            'https://ucarecdn.com/94ea669c-f4f3-4f21-a40e-1667828ccc7b/goodmorning5.gif',
            'https://ucarecdn.com/85eeed53-06ab-4d51-aba1-829edf84fc2a/goodmorning1.gif',
            'https://ucarecdn.com/cc8fa9c0-e969-4d4f-b633-e36ce973c8ac/goodmorning4.gif',
            'https://ucarecdn.com/726b77fd-674e-418a-8c83-2e8784dbb275/goodmorning3.gif',
            'https://ucarecdn.com/fe77154c-789c-486c-ae07-7272aae1354e/goodmorning.gif', ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle("Good Morning")
            .setDescription(`${member} says good morning${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};