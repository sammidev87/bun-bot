const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

count = 0;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("hug")
        .setDescription("Hug someone.")
        .addMentionableOption(opt => opt.setName("user").setDescription("The user you want to hug.").setRequired(false))
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

        const gifs = [ 'https://ucarecdn.com/10a62c41-e25a-4835-8e21-e82cd68223b5/hug5.gif',
            'https://ucarecdn.com/e11bd51e-76db-401c-ad6f-7458cbf04999/hug.gif',
            'https://ucarecdn.com/2fce35a1-5484-427f-8b1f-e2a6f77617b2/hug1.gif',
            'https://ucarecdn.com/d755d69e-47b2-4544-b175-fbe7f7adfca5/hug2.gif',
            'https://ucarecdn.com/85faaded-144b-46a6-be4e-855c276a2885/hug4.gif',
            'https://ucarecdn.com/4dc8883d-78aa-4efd-b65c-4710b9d58ff9/hug3.gif', ];

        if (count >= gifs.length) count = 0;

        const image = gifs[ count ];

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle("Hug")
            .setDescription(`${member} hugs${pingText}!`)
            .setImage(image)
            .setFooter({ text: "Roleplay by Bun Bot" })
            .setTimestamp();

        count++;
        if (!Mention) return interaction.reply({ embeds: [ embed ] });
        else if (Mention) return interaction.reply({ content: `${Mention}`, embeds: [ embed ] });

    }
};