const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nini")
        .setDescription("Say goodnight to someone.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to tell goodnight to.").setRequired(false))
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

        const gifs = [ 'https://ucarecdn.com/11651f47-b5fc-425e-b5ad-54a58dda21de/nini1.gif',
            'https://ucarecdn.com/694b894d-fe7f-4c7a-8701-414b1f16dfd6/nini2.gif',
            'https://ucarecdn.com/30385759-e114-40d4-891d-da9708a2ba20/nini5.gif',
            'https://ucarecdn.com/9579b80a-80eb-4ea9-8574-63f8fff2db2a/nini4.gif',
            'https://ucarecdn.com/96c5b9e5-7c69-4579-a513-934e0dae080d/nini3.gif',
            'https://ucarecdn.com/fd411297-7077-4582-977b-c520828521d1/nini.gif', ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle("Goodnight")
            .setDescription(`${member} says goodnight${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};