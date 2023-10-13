const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bite")
        .setDescription("Bite someone.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to bite").setRequired(false))
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

        const gifs = [ 'https://ucarecdn.com/d799fd27-fe64-40cd-928f-0b1d68f42c6e/bite3.gif',
            'https://ucarecdn.com/4ef1f0b9-49d0-40ad-931b-8e869912fd94/bite5.gif',
            'https://ucarecdn.com/e89038eb-4747-43b1-8dbd-cfbb786745b2/bite10.gif',
            'https://ucarecdn.com/a51f962e-a434-4572-89b8-bfde0919e560/bite8.gif',
            'https://ucarecdn.com/d7137e02-8cdc-45d7-a95a-beb9d2efdcd1/bite1.gif',
            'https://ucarecdn.com/20dba945-336e-45f0-8779-41ee8ff1ac42/bite7.gif',
            'https://ucarecdn.com/de701484-ac15-4df6-a02f-9e09c43ffb2e/bite6.gif',
            'https://ucarecdn.com/70fbb344-96af-4145-8cff-bc2ba4ff0a29/bite2.gif',
            'https://ucarecdn.com/45f0a03d-d0f0-40ce-b84c-5e30c80028e4/bite.gif',
            'https://ucarecdn.com/4c3ce9f7-78ca-451a-acff-97ee5507bf32/bite4.gif',
            'https://ucarecdn.com/c5362f4a-339d-449d-a0fc-c82610c7c4cc/bite9.gif' ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle("Bite")
            .setDescription(`${member} bites${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};