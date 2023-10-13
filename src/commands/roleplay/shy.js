const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shy")
        .setDescription("Shy.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to be shy from.").setRequired(false))
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
        else if (!Text && Mention) pingText = ` from ${Mention}`;
        else if (Text && Mention) pingText = ` from ${Mention} ${Text}`;

        const gifs = [ 'https://ucarecdn.com/7e2033bd-58e2-4fee-b135-4d6b98b5c5eb/shy2.gif',
            'https://ucarecdn.com/dc4ff860-95fe-40c4-8df6-f0fc54d949c1/shy5.gif',
            'https://ucarecdn.com/82a58dc0-07d4-4333-8eac-8b9df92571dc/shy1.gif',
            'https://ucarecdn.com/98ab089d-3e9b-4cfd-a832-203b501d0e46/shy4.gif',
            'https://ucarecdn.com/e4b8da1b-5623-4cdc-bd05-a0c2262f5a72/shy.gif',
            'https://ucarecdn.com/24df3c50-95b3-469c-90e5-f622c72d3a8c/shy3.gif', ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle("Shy")
            .setDescription(`${member} is shy${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};